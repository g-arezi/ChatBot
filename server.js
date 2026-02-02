require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { DateTime } = require('luxon');
const axios = require('axios');
const nodemailer = require('nodemailer');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const PORT = process.env.PORT || 3001; // switched default to 3001 to avoid EADDRINUSE in local test
const EVOLUTION_BASE = process.env.EVOLUTION_API_BASE_URL;
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY;
const EVOLUTION_PHONE_ID = process.env.EVOLUTION_PHONE_ID;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const BUSINESS_TZ = process.env.BUSINESS_TZ || 'America/Sao_Paulo';
const BUSINESS_START = parseInt(process.env.BUSINESS_START_HOUR || '9', 10);
const BUSINESS_END = parseInt(process.env.BUSINESS_END_HOUR || '18', 10);
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';
const WEBHOOK_SECRET = process.env.EVOLUTION_WEBHOOK_SECRET || '';

const { initWhatsAppClient, sendTextViaWA, sendButtonsViaWA, sendListViaWA, isReady: waIsReady, events: waEvents } = require('./whatsapp-client');

// WhatsApp fallback client (Baileys)
// Initialize WhatsApp client in background for quicker fallback/usage
try { initWhatsAppClient(); } catch (e) { console.warn('WA init failed', e?.message || e); }

// Subscribe to incoming WhatsApp messages and channel them into our processWebhookBody
try {
  waEvents.on('message', async (m) => {
    try {
      // m: { from: '5511999999999@s.whatsapp.net', text: '...' , raw: <wa message> }
      const body = {
        from: m.from,
        text: m.text,
        _source: 'whatsapp_webjs'
      };
      // If the whatsapp-client emitted an interactive selection, map it into Evolution-like structure
      if (m.selectedId) {
        body.data = body.data || {};
        body.data.message = body.data.message || {};
        body.data.message.buttonsResponseMessage = { selectedButtonId: m.selectedId };
      }
      if (m.selectedRowId) {
        body.data = body.data || {};
        body.data.message = body.data.message || {};
        body.data.message.listResponseMessage = { singleSelectReply: { selectedRowId: m.selectedRowId } };
      }
       // process in background
       await processWebhookBody(body);
    } catch (err) {
      console.error('Error processing WA incoming message', err?.message || err);
    }
  });
} catch (e) {
  // ignore if events not available yet
}

// Setup DB (lowdb)
const dbFile = path.join(__dirname, 'db.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { defaultData: { conversations: [], logs: [] } });

async function initDb() {
  await db.read();
  // Normalize older defaultData wrapper if present
  if (db.data && db.data.defaultData) {
    db.data = db.data.defaultData;
  }
  db.data = db.data || { conversations: [], logs: [] };
  await db.write();
}

initDb();

// Setup email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, text) {
  if (!process.env.EMAIL_HOST) return;
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  } catch (err) {
    console.error('Email send error', err?.message || err);
  }
}

// Evolution API helper
async function sendEvolutionMessage(payload) {
  // helper: convert an Evolution-style payload into a fallback text for WhatsApp
  const payloadToFallbackText = (p) => {
    try {
      // text payload
      if (p.type === 'text' && p.text) return (p.text.body || p.text).toString();
      if (p.text && (p.text.body || typeof p.text === 'string')) return (p.text.body || p.text).toString();
      if (p.message) return (typeof p.message === 'string' ? p.message : JSON.stringify(p.message));
      // interactive: buttons or list -> convert to readable text
      if (p.type === 'interactive' && p.interactive) {
        const it = p.interactive;
        let out = '';
        if (it.header && it.header.text) out += `${it.header.text}\n\n`;
        if (it.body && it.body.text) out += `${it.body.text}\n\n`;
        if (it.action) {
          if (it.action.buttons && Array.isArray(it.action.buttons)) {
            out += 'Opções:\n';
            it.action.buttons.forEach((b, i) => { out += `${i+1}. ${b.reply?.title || b.title || b.text || 'Opção'}\n`; });
          }
          if (it.action.sections && Array.isArray(it.action.sections)) {
            it.action.sections.forEach((s) => {
              if (s.rows) s.rows.forEach((r, i) => { out += `${r.id || r.title}: ${r.title}\n`; });
            });
          }
        }
        return out || JSON.stringify(p.interactive);
      }
      // default fallback
      return JSON.stringify(p).slice(0, 800);
    } catch (e) {
      return String(p).slice(0,800);
    }
  };

  // Helper to attempt WA fallback given the payload
  const tryWhatsAppFallback = async (p) => {
    try {
      const to = p.to || p.phone || (p.payload && (p.payload.to || p.payload.phone)) || '';
      if (!to) return { ok: false, reason: 'missing to' };
      if (!waIsReady()) initWhatsAppClient();
      let attempts = 0;
      while (!waIsReady() && attempts < 10) { await new Promise(r => setTimeout(r, 500)); attempts++; }
      if (!waIsReady()) return { ok: false, reason: 'wa not ready' };

      // If interactive payload, try to send buttons or list
      if (p.type === 'interactive' && p.interactive) {
        const it = p.interactive;
        if (it.type === 'button' || it.type === 'buttons' || (it.action && it.action.buttons)) {
          // Build buttons array expected by sendButtonsViaWA
          const buttonsArray = (it.action && it.action.buttons) || it.buttons || [];
          const bodyText = (it.body && it.body.text) || (it.title || '') || payloadToFallbackText(p);
          const footer = (it.footer && it.footer.text) || '';
          const resWa = await sendButtonsViaWA(to, bodyText, buttonsArray, footer);
          return { ok: true, provider: 'whatsapp', result: resWa };
        }
        if (it.type === 'list' || (it.action && it.action.sections)) {
          const sections = it.action && it.action.sections ? it.action.sections : (it.sections || []);
          const bodyText = (it.body && it.body.text) || payloadToFallbackText(p);
          const buttonText = (it.action && it.action.button) || 'Ver opções';
          const title = (it.header && it.header.text) || '';
          const footer = (it.footer && it.footer.text) || '';
          const resWa = await sendListViaWA(to, bodyText, buttonText, sections, title, footer);
          return { ok: true, provider: 'whatsapp', result: resWa };
        }
      }

      // Default: send plain text fallback
      const text = payloadToFallbackText(p);
      if (!text) return { ok: false, reason: 'missing text' };
      const resWa = await sendTextViaWA(to, text);
      return { ok: true, provider: 'whatsapp', result: resWa };
    } catch (e) {
      console.error('WhatsApp fallback error', e?.message || e);
      return { ok: false, reason: e?.message || String(e) };
    }
  };

  // If payload is interactive, FORCE sending via WhatsApp (ignore Evolution) and log the response
  if (payload && payload.type === 'interactive') {
    try {
      const r = await tryWhatsAppFallback(payload);
      // persist a log entry about the send attempt
      try {
        await db.read();
        db.data.logs.push({ id: nanoid(), phone: payload.to || payload.phone || '', text: `forced_wa_send:${JSON.stringify(r).slice(0,800)}`, timestamp: new Date().toISOString() });
        await db.write();
      } catch (dbErr) {
        console.warn('Could not write forced WA log to DB', dbErr?.message || dbErr);
      }
      console.log('FORCED WA SEND RESULT', r);
      return { forced_whatsapp: true, result: r };
    } catch (e) {
      console.warn('WhatsApp interactive forced attempt errored', e?.message || e);
      // fall through to try Evolution if WA forced attempt threw
    }
  }

  // If Evolution is not configured, try WA fallback directly
  if (!EVOLUTION_BASE || !EVOLUTION_KEY) {
    console.log('Evolution not configured — attempting WhatsApp fallback for payload');
    const r = await tryWhatsAppFallback(payload);
    if (r.ok) return { fallback: 'whatsapp', result: r.result };
    console.log('WhatsApp fallback failed or not ready, skipping send', r.reason);
    return { skipped: true, reason: r.reason };
  }

  // Otherwise, try Evolution first and fallback to WhatsApp on failure
  try {
    const url = `${EVOLUTION_BASE.replace(/\/$/, '')}/messages`;
    const res = await axios.post(url, payload, { headers: { Authorization: `Bearer ${EVOLUTION_KEY}` } });
    return res.data;
  } catch (err) {
    console.error('Evolution send error', err?.response?.data || err.message);
    const r = await tryWhatsAppFallback(payload);
    if (r.ok) return { fallback: 'whatsapp', result: r.result };
    throw err;
  }
}

// Utilities
function normalizeNumber(raw) {
  // try to extract digits and ensure +country
  const digits = (raw || '').replace(/[^0-9]/g, '');
  if (!digits) return raw;
  if (digits.length === 11 && digits.startsWith('55')) return `+${digits}`;
  if (digits.length === 13 && digits.startsWith('55')) return `+${digits}`;
  if (digits.length === 13 && digits.startsWith('0055')) return `+${digits.slice(2)}`;
  if (!digits.startsWith('55')) return `+55${digits}`;
  return `+${digits}`;
}

function inBusinessHours(dt) {
  const now = dt.setZone(BUSINESS_TZ);
  const hour = now.hour;
  const weekday = now.weekday; // 1..7 (Mon..Sun)
  return weekday >= 1 && weekday <= 5 && hour >= BUSINESS_START && hour < BUSINESS_END;
}

function isEmergencyText(text) {
  if (!text) return false;
  const t = text.toLowerCase();
  const keywords = [
    'suicid', 'me matar', 'matar', 'morrer', 'morte', 'acabar com tudo',
    'nao aguento', 'não aguento', 'desespero', 'desesperad', 'crise', 'emergenc', 'urgente', 'socorro', 'vou pular', 'vou me jogar'
  ];
  return keywords.some(k => t.includes(k));
}

// Messages from Script.md (extracted)
const MSG = {
  welcome: `Olá! Seja muito bem-vindo(a)! 💙\n\nEu sou a Dra. Paula Teixeira Pacheco (CRM-SP 205251).\n\nAcredito que tratar a mente é cuidar da alma inteira. Sim, a medicação pode ser necessária - ela acalma tempestades, equilibra neuroquímicos, traz alívio. Mas meu olhar vai além: vejo você como um ser completo, com história, emoções, sonhos e dores que pedem para serem compreendidas, não apenas silenciadas.\n\nIntegro neurociência, psicanálise, filosofia, budismo e estoicismo porque sei que a cura verdadeira acontece quando ciência e alma se encontram. Cada sintoma é um mensageiro - e juntos vamos decifrar o que ele tem a dizer.\n\n✨ Aqui, você não é um diagnóstico. É um universo a ser compreendido.\n\nComo posso ajudar você hoje? Escolha uma das opções abaixo:`,
  menuPrompt: `Como posso ajudar você hoje? Escolha uma das opções abaixo:`,
  option1: `💰 VALORES DAS CONSULTAS:\n\n🧑‍⚕️ Psiquiatria Adulto: R$ 500,00 \n👶 Psiquiatria Infantil: R$ 600,00\n\n💳 FORMAS DE PAGAMENTO:\n• PIX (à vista)\n• Cartão de crédito (até 2x com juros do cartão)\n\n📌 COMO FUNCIONA O PAGAMENTO:\n• 50% de sinal no agendamento\n• 50% restantes até 24h antes da consulta\n\n🏥 ATENDIMENTO:\n• 100% Online (Google Meet)\n• Não atendemos por planos de saúde\n• Fornecemos recibo para reembolso\n\n---\n\nO que deseja fazer agora?`,
  option2: `🩺 COMO FUNCIONA A CONSULTA\n\n⏰ DURAÇÃO: Aproximadamente 50 minutos\n💻 FORMATO: 100% Online via Google Meet\n\nVamos conversar sobre:\n\n📖 SUA HISTÓRIA:\n• O que te trouxe até mim? Qual é sua dor?\n• Sua trajetória de vida\n• Momentos marcantes - traumas, perdas, transformações\n\n💊 SEU HISTÓRICO DE TRATAMENTO:\n• Já fez terapia ou tratamento psiquiátrico antes?\n• Que medicações já usou? Como foi? Funcionou? Teve efeitos colaterais?\n• O que já tentou e não deu certo?\n\n🧭 NOSSO CAMINHO:\nJuntos, vamos construir um caminho terapêutico que faça sentido para sua vida. Aqui, você encontrará não apenas o suporte medicamentoso quando necessário, mas um olhar integral que une psicologia, psicanálise, mindfulness, filosofia e espiritualidade — ferramentas que estudo constantemente para compreender você em sua totalidade e profundidade.\n\n⚠️ IMPORTANTE SOBRE RETORNOS:\n• Não trabalhamos com consultas de retorno\n• Laudos, atestados e renovação de receitas requerem nova consulta\n\n---\n\nO que deseja fazer agora?`,
  option3: `🌀 HIPNOTERAPIA CLÍNICA\n\nSabe aquela dor que você carrega há anos? Aquele medo que não tem explicação lógica? Aquele padrão destrutivo que você repete mesmo sabendo que te faz mal?\n\nÉ lá, no seu inconsciente, que essas raízes estão plantadas.\n\nA hipnoterapia é um caminho para chegar nessas profundezas - não para apagá-las, mas para ressignificá-las, integrá-las, transformá-las.\n\n👉 É um trabalho delicado, profundo e transformador. Não é mágica. Não é espetáculo. É ciência com alma.\n\n⚠️ Não prometo cura, mas sim um encontro verdadeiro com partes de você que pedem para serem vistas e acolhidas.\n\n---\n\n💰 COMO FUNCIONA:\n\n✳️ 1ª ETAPA - Consulta de Avaliação (obrigatória)\n⏰ Duração: 1 hora\n💵 Valor: R$ 500 (adulto) ou R$ 600 (infantil)\n\nNeste primeiro encontro:\n• Preciso conhecer sua dor de perto\n• Vou te explicar detalhadamente:\n  - O que é Hipnoterapia de verdade (longe dos mitos)\n  - Como funciona o processo\n  - Riscos e benefícios reais\n  - Se há indicação para o seu caso específico\n\nEste é um tempo dedicado inteiramente a você. Por isso, o valor não é reembolsável caso decida não seguir.\n\n✳️ 2ª ETAPA - Sessões (se indicado e você escolher)\n💵 Valor: R$ 3.000,00 (tratamento completo)\n📅 Formato: Geralmente 4 sessões de 1h a 1h30\n🔄 Frequência: 1 sessão por semana\n💳 Pagamento: Cartão de crédito (até 5x com juros do cartão)\n\n---\n\nO que deseja fazer agora?`,
  option4: `🧠 PROJETO MENTES FORTES\n\nVivemos uma epidemia silenciosa de adoecimento mental. E a resposta não está apenas em tratar quem já adoeceu - está em prevenir, educar, fortalecer.\n\nTodos os dias atendo pessoas que chegam ao meu consultório tarde demais - depois que a ansiedade já tomou conta, depois que a depressão já se instalou, depois que os padrões destrutivos já estão enraizados.\n\n📌 O Projeto Mentes Fortes leva para escolas, empresas e instituições ferramentas reais de saúde mental - não discursos vazios de autoajuda, mas conhecimento científico integrado à sabedoria prática.\n\n---\n\n🎯 PARA QUEM É:\n\n🔷️ ADULTOS:\nNão é palestra motivacional. É compreensão profunda sobre ansiedade, relacionamentos, sentido existencial - com ferramentas que funcionam de verdade.\n\n🔷️ PAIS E EDUCADORES:\nComo criar filhos emocionalmente inteligentes, resilientes e preparados para os desafios reais - longe das ilusões da "psicologia positiva" que falha.\n\n---\n\n📧 QUER SABER MAIS SOBRE CONTEÚDO, FORMATO E VALORES?\n\nEntre em contato:\n📩 mentesfortes.psiquiatria@gmail.com\n\n📱 Siga nosso trabalho:\n👨‍👩‍👧 Para pais e educadores: @projetomentesfortes_\n🧑‍⚕️ Para adultos: @projetomenteforte_psiquiatria\n\nCada projeto é único, construído com cuidado para sua realidade. 💙\n\n---\n\nO que deseja fazer agora?`,
  option5: `📅 POLÍTICA DE AGENDAMENTO E CANCELAMENTO\n\nConsultas são agendadas diretamente com nossa secretária. Solicite um horário e ela verificará a disponibilidade, informará valores e solicitará o sinal para confirmação.\n\n---\n\n💰 AGENDAMENTO:\n\n📌 SINAL (50% do valor):\n• Pago no momento do agendamento\n• PIX ou cartão de crédito (até 2x com juros)\n\n📌 RESTANTE (50% do valor):\n• Pago até 24h antes da consulta\n• PIX ou cartão de crédito (até 2x com juros)\n\n---\n\n🔄 CANCELAMENTO:\n\n✅ COM 72h (3 DIAS) DE ANTECEDÊNCIA:\n• Sem multa\n• Valor pago vira crédito para reagendar\n\n❌ COM MENOS DE 72h:\n• Perda total do valor pago\n• Sem possibilidade de reembolso ou crédito\n\n---\n\nO que deseja fazer agora?`,
  emergency: `🆘 EMERGÊNCIA - AJUDA IMEDIATA\n\nSe você está em crise ou risco imediato, precisa de ajuda AGORA:\n\n📞 CVV - Centro de Valorização da Vida\nLigue: 188 (24 horas, gratuito)\nChat: www.cvv.org.br \n\n🚨 SAMU - Serviço de Atendimento Móvel de Urgência\nLigue: 192\n\n🏥 PRONTO-SOCORRO PSIQUIÁTRICO\nProcure o hospital de emergência psiquiátrica mais próximo de você agora.\n\n---\n\n⚠️ IMPORTANTE:\n\nNossa consulta online NÃO substitui atendimento de emergência.\n\nSe você está em risco imediato, por favor, busque ajuda presencial urgente ou ligue para os números acima.\n\n💙 Você não está sozinho(a). A vida vale a pena. Procure ajuda agora.\n\nSe esta não é uma emergência e você gostaria de agendar uma consulta, fale com nossa secretária.`,
  afterLeaveConfirm: `Mensagem recebida! ✅\n\nObrigada! Retornaremos em breve.\n\nTenha um ótimo dia/noite! 💙\nDra. Paula Teixeira Pacheco`,
  fallback: `Desculpe, não entendi sua mensagem. 😊\n\nPara te ajudar melhor, escolha uma das opções do menu:`
};

// Express app
const app = express();
// Security middlewares
app.use(helmet());
app.use(rateLimit({ windowMs: 1000 * 60, max: 120 }));
app.use(express.json());
app.use(morgan('tiny'));

// Simple health
app.get('/', (req, res) => res.send('Dra. Paula Chatbot - Evolution API Bridge'));

// Admin auth middleware
function requireAdminKey(req, res, next) {
  const key = req.headers['x-admin-key'] || req.query.api_key || '';
  if (!ADMIN_API_KEY || key === ADMIN_API_KEY) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

// Protected send-text endpoint for admins/integration
app.post('/send-text', requireAdminKey, async (req, res) => {
  try {
    const { to, text } = req.body;
    if (!to || !text) return res.status(400).json({ error: 'Missing to or text' });
    const contact = normalizeNumber(to);
    const r = await sendEvolutionMessage({ to: contact, type: 'text', text: { body: text } });
    return res.json({ ok: true, result: r });
  } catch (err) {
    console.error('send-text error', err?.message || err);
    return res.status(500).json({ error: 'send failed' });
  }
});

// Admin endpoints
app.get('/admin/conversations', requireAdminKey, async (req, res) => {
  await db.read();
  res.json(db.data.conversations || []);
});

app.get('/admin/logs', requireAdminKey, async (req, res) => {
  await db.read();
  res.json(db.data.logs || []);
});

app.post('/admin/email-test', requireAdminKey, async (req, res) => {
  const to = req.body.to || ADMIN_EMAIL;
  await sendEmail(to, 'Teste de Email - Chatbot', 'Se você recebeu isto, configuração de email está OK.');
  res.json({ ok: true });
});

// If webhook secret is provided, use raw body verification for this route
if (WEBHOOK_SECRET) {
  // Raw body parsing for signature verification
  app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    res.status(200).json({ received: true });
    try {
      const sigHeader = req.headers['x-evolution-signature'] || req.headers['x-hub-signature'] || req.headers['x-signature'];
      const computed = crypto.createHmac('sha256', WEBHOOK_SECRET).update(req.body).digest('hex');
      if (sigHeader && sigHeader !== computed) {
        console.warn('Webhook signature mismatch');
        return;
      }
      const body = JSON.parse(req.body.toString('utf8'));
      // continue processing below by delegating to the existing handler logic
      await processWebhookBody(body);
    } catch (err) {
      console.error('Webhook processing error', err?.message || err);
    }
  });
} else {
  app.post('/webhook', async (req, res) => {
    res.status(200).json({ received: true });
    try {
      const body = req.body;
      await processWebhookBody(body);
    } catch (err) {
      console.error('Webhook processing error', err?.message || err);
    }
  });
}

// Extracted processing logic for webhook bodies
async function processWebhookBody(body) {
  try {
    // Attempt to parse common fields from webhook
    // Support multiple possible shapes; we normalize
    const rawFrom = body?.from || body?.sender || body?.body?.from || body?.data?.from || body?.data?.key?.remoteJid || body?.data?.message?.from;
    const contact = normalizeNumber(rawFrom);

    // Message text detection
    const message_text = (body?.text || body?.body?.text || body?.data?.message?.conversation || body?.data?.message?.extendedTextMessage?.text || body?.data?.message?.buttonsResponseMessage?.selectedButtonId || body?.data?.message?.listResponseMessage?.singleSelectReply?.selectedRowId || body?.data?.message?.buttonsResponseMessage?.selectedButtonId || body?.message?.text || '')
      .toString();

    // interactive id detection
    const interactive_id = body?.data?.message?.buttonsResponseMessage?.selectedButtonId || body?.data?.message?.listResponseMessage?.singleSelectReply?.selectedRowId || body?.interactive?.id || '';

    const timestamp = body?.timestamp || Date.now();

    // Normalize conversation record
    await db.read();
    let conv = db.data.conversations.find(c => c.phone === contact);
    if (!conv) {
      conv = { id: nanoid(), phone: contact, state: 'idle', first_seen: new Date().toISOString(), last_message: '', last_intent: null };
      db.data.conversations.push(conv);
      await db.write();
    }

    // Log
    db.data.logs.push({ id: nanoid(), phone: contact, text: message_text, timestamp: new Date().toISOString() });
    await db.write();

    // EMERGENCY check - priority
    if (isEmergencyText(message_text) || interactive_id === 'opt_emg' || /\\bespresso\\b/.test(message_text)) {
      // Send emergency message
      await sendEvolutionMessage({
        to: contact,
        type: 'text',
        text: { body: MSG.emergency }
      });

      // Send buttons as follow-up
      await sendEvolutionMessage({
        to: contact,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: { text: 'Se esta não é uma emergência e você gostaria de agendar uma consulta, fale com nossa secretária.' },
          action: { buttons: [ { type: 'reply', reply: { id: 'talk_secretary', title: '💬 Falar com a Secretária' } }, { type: 'reply', reply: { id: 'back_menu', title: '⬅️ Voltar ao Menu Principal' } } ] }
        }
      });

      // Mark conversation emergency and notify
      conv.state = 'emergency';
      conv.emergency_at = new Date().toISOString();
      await db.write();

      // Notify admin via email
      await sendEmail(ADMIN_EMAIL, `⚠️ ALERTA URGENTE: Mensagem de crise - ${contact}`, `Mensagem detectada: "${message_text}"\n\nContato: ${contact}\nTimestamp: ${new Date().toISOString()}`);
      return;
    }

    // If state awaiting left message and message_text present
    if (conv.state === 'awaiting_left_message') {
      conv.left_message = message_text;
      conv.left_message_at = new Date().toISOString();
      conv.state = 'idle';
      await db.write();

      // Email to secretary
      await sendEmail(ADMIN_EMAIL, `💬 Nova Mensagem Deixada - ${contact}`, `O usuário ${contact} deixou a seguinte mensagem:\n\n"${message_text}"\n\nPor favor, retorne o contato no próximo dia útil.`);

      // Confirm to user
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: MSG.afterLeaveConfirm } });
      return;
    }

    // If interactive id present (list or button)
    if (interactive_id) {
      // Map ids to actions
      switch (interactive_id) {
        case 'opt_1':
        case 'OPTION_1_VALORES':
        case '1':
        case '1️⃣':
          await handleOption(contact, 'valores');
          return;
        case 'opt_2':
        case 'OPTION_2_CONSULTA':
          await handleOption(contact, 'consulta');
          return;
        case 'opt_3':
        case 'OPTION_3_HIPNOTERAPIA':
          await handleOption(contact, 'hipnoterapia');
          return;
        case 'opt_4':
        case 'OPTION_4_MENTES_FORTES':
          await handleOption(contact, 'mentesfortes');
          return;
        case 'opt_5':
        case 'OPTION_5_AGENDAMENTO_CANCELAMENTO':
          await handleOption(contact, 'agendamento');
          return;
        case 'opt_emg':
        case 'OPTION_SOS_URGENTE':
          // Trigger emergency above
          await sendEvolutionMessage({ to: contact, type: 'text', text: { body: MSG.emergency } });
          return;
        case 'opt_secret':
        case 'ACTION_FALAR_SECRETARIA':
        case 'talk_secretary':
          await handleTalkSecretary(contact);
          return;
        case 'MORE_OPTS':
          await sendFullMenu(contact);
          return;
         case 'back_menu':
         case 'ACTION_VOLTAR_MENU':
           await sendMenu(contact);
           return;
         case 'leave_msg':
         case 'ACTION_DEIXAR_MSG':
          conv.state = 'awaiting_left_message';
          await db.write();
          await sendEvolutionMessage({ to: contact, type: 'text', text: { body: `Perfeito! Por favor, envie sua mensagem com:\n\n📝 Seu nome completo:\n📱 Seu telefone:\n💬 Motivo do contato:` } });
          return;
        default:
          // Unknown interactive id - fallback to menu
          await sendMenu(contact);
          return;
      }
    }

    // If user typed a number 1-7 (plain text menu selection), map to the corresponding action
    const numericReply = message_text.trim();
    if (/^[1-7]$/.test(numericReply)) {
      switch (numericReply) {
        case '1':
          await handleOption(contact, 'valores');
          return;
        case '2':
          await handleOption(contact, 'consulta');
          return;
        case '3':
          await handleOption(contact, 'hipnoterapia');
          return;
        case '4':
          await handleOption(contact, 'mentesfortes');
          return;
        case '5':
          await handleOption(contact, 'agendamento');
          return;
        case '6':
          await sendEvolutionMessage({ to: contact, type: 'text', text: { body: MSG.emergency } });
          return;
        case '7':
          await handleTalkSecretary(contact);
          return;
      }
    }

    // No interactive - keyword matching
    const text = (message_text || '').toLowerCase();

    if (/(^|\s)(oi|olá|ola|opa|hey|bom dia|boa tarde|boa noite)(\s|$)/.test(text)) {
      await sendWelcomeAndMenu(contact, conv);
      return;
    }

    // Thank you
    if (/(obrigad|valeu|thanks|thank)/.test(text)) {
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: 'Por nada! 💙 Estou aqui para ajudar.\n\nPrecisa de mais alguma informação?' } });
      await sendMenu(contact);
      return;
    }

    // Location
    if (/(onde fica|endereço|local|clínica)/.test(text)) {
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: 'Meu atendimento é 100% online via Google Meet. Digite:\n2 para "Como funciona a Consulta"\n7 para "Falar com a Secretária"\n0 para retornar ao menu.' } });
      return;
    }

    // Availability/hr
    if (/(horário|quando|disponível|agenda|vaga)/.test(text)) {
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: 'Nossa secretária pode ajudar a verificar horários. Digite 7 para falar com a secretária ou 0 para voltar ao menu.' } });
      return;
    }

    // Clinical questions
    if (/(ansiedade|depressão|pânico|panico|remédio|remedio|medicação|medicacao|diagnóstico|diagnostico|tratamento)/.test(text)) {
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: 'Questões clínicas precisam ser avaliadas em consulta. Digite:\n2 para "Como funciona a Consulta"\n7 para falar com a secretária\n0 para voltar ao menu.' } });
      return;
    }

    // Scheduling keywords
    if (/(agendar|agendamento|cancelar|remarcar)/.test(text)) {
      await handleOption(contact, 'agendamento');
      return;
    }

    // Fallback - not recognized
    await sendEvolutionMessage({ to: contact, type: 'text', text: { body: MSG.fallback } });
    // Provide textual menu as fallback
    await sendMenu(contact);

  } catch (err) {
    console.error('processWebhookBody error', err?.message || err);
  }
}

// Helper: send menu as plain numbered text (1-7) for maximum compatibility
async function sendMenu(contact) {
  const menuText = `Olá! Como posso ajudar você hoje? Escolha uma opção digitando o número correspondente:\n\n1) Valores e Formas de Pagamento\n2) Como funciona a Consulta\n3) Hipnoterapia Clínica\n4) Projeto Mentes Fortes\n5) Política de Agendamento e Cancelamento\n6) Preciso de ajuda urgente\n7) Falar com a Secretária\n\nDigite 1-7 para escolher ou 0 para ver o menu novamente.`;
  await sendEvolutionMessage({ to: contact, type: 'text', text: { body: menuText } });
}

async function sendWelcomeAndMenu(contact, conv) {
  await sendEvolutionMessage({ to: contact, type: 'text', text: { body: MSG.welcome } });
  await sendMenu(contact);
  conv.last_intent = 'welcome';
  conv.last_message = '';
  await db.write();
}

async function handleOption(contact, key) {
  switch (key) {
    case 'valores':
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: MSG.option1 } });
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: 'Digite 0 para voltar ao menu ou 7 para falar com a secretária.' } });
      await updateConvIntent(contact, 'valores');
      break;
    case 'consulta':
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: MSG.option2 } });
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: 'Digite 0 para voltar ao menu ou 7 para falar com a secretária.' } });
      await updateConvIntent(contact, 'consulta');
      break;
    case 'hipnoterapia':
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: MSG.option3 } });
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: 'Digite 0 para voltar ao menu ou 7 para falar com a secretária.' } });
      await updateConvIntent(contact, 'hipnoterapia');
      break;
    case 'mentesfortes':
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: MSG.option4 } });
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: 'Digite 0 para voltar ao menu ou 7 para falar com a secretária.' } });
      await updateConvIntent(contact, 'mentesfortes');
      break;
    case 'agendamento':
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: MSG.option5 } });
      await sendEvolutionMessage({ to: contact, type: 'text', text: { body: 'Digite 0 para voltar ao menu ou 7 para falar com a secretária.' } });
      await updateConvIntent(contact, 'agendamento');
      break;
    default:
      await sendMenu(contact);
      break;
  }
}

async function handleTalkSecretary(contact) {
  await db.read();
  const conv = db.data.conversations.find(c => c.phone === contact);
  const now = DateTime.now().setZone(BUSINESS_TZ);
  if (inBusinessHours(DateTime.now())) {
    // Transfer to human
    await sendEvolutionMessage({ to: contact, type: 'text', text: { body: 'Ótimo! Vou te transferir para atendimento humano agora! 😊\n\nNossa secretária está disponível e vai te atender com todo carinho!\n\nAguarde um momento...' } });
    conv.state = 'transferred_to_human';
    conv.handoff_at = new Date().toISOString();
    await db.write();
    // Notify secretary
    await sendEmail(ADMIN_EMAIL, `🔔 Novo atendimento humano solicitado - ${contact}`, `O usuário ${contact} solicitou atendimento humano. Por favor, assuma a conversa.`);
  } else {
    // Outside hours
    await sendEvolutionMessage({ to: contact, type: 'text', text: { body: 'Obrigada pelo contato! 💙\n\nNo momento estamos fora do horário de atendimento.\n\n📅 NOSSO HORÁRIO:\nSegunda a Sexta, das 9h às 18h\n\n---\n\nO QUE VOCÊ PODE FAZER:\n\n1️⃣ DEIXAR UMA MENSAGEM:\nDeixe seu nome, telefone e motivo do contato.\nRetornaremos no próximo dia útil!\n\n2️⃣ VOLTAR AMANHÃ:\nEstaremos disponíveis a partir das 9h!\n\n---\n\nDeseja deixar uma mensagem?' } });
    await sendEvolutionMessage({ to: contact, type: 'interactive', interactive: { type: 'button', body: { text: 'Deseja deixar uma mensagem?' }, action: { buttons: [ { type: 'reply', reply: { id: 'leave_msg', title: '✅ Sim, quero deixar msg' } }, { type: 'reply', reply: { id: 'back_menu', title: '⬅️ Voltar ao Menu Principal' } } ] } } });
  }
}

async function updateConvIntent(contact, intent) {
  await db.read();
  const conv = db.data.conversations.find(c => c.phone === contact);
  if (!conv) return;
  conv.last_intent = intent;
  conv.last_message = new Date().toISOString();
  await db.write();
}

// Start server (resilient: try preferred PORT, else fall back to ephemeral port)
async function startServer(preferredPort) {
  const tryPort = (p) => new Promise((resolve, reject) => {
    const srv = app.listen(p, () => {
      const actual = srv.address() && srv.address().port;
      console.log(`Server listening on port ${actual}`);
      try { require('fs').writeFileSync(path.join(__dirname,'server-port.txt'), String(actual)); } catch(e){console.warn('Could not write server-port.txt', e?.message||e);}
      resolve(srv);
    });
    srv.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.warn(`Port ${p} in use, will try another port.`);
        resolve(null);
      } else {
        reject(err);
      }
    });
  });

  let server = await tryPort(preferredPort);
  if (!server) {
    server = await tryPort(0); // let OS pick a free port
  }
  if (!server) {
    console.error('Failed to bind server to any port');
    process.exit(1);
  }
  return server;
}

(async () => {
  try {
    await startServer(parseInt(process.env.PORT || PORT, 10));
  } catch (e) {
    console.error('Server failed to start', e?.message || e);
    process.exit(1);
  }
})();
