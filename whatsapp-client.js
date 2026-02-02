const { Client, LocalAuth, Buttons, List } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const EventEmitter = require('events');

const events = new EventEmitter();

let client = null;
let ready = false;

function initWhatsAppClient() {
  if (client) return;
  client = new Client({ authStrategy: new LocalAuth({ clientId: 'dra-paula' }) });

  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('\n[wa] QR code generated in terminal. Scan it with WhatsApp mobile to authenticate.');
  });

  client.on('ready', () => {
    console.log('[wa] WhatsApp client ready');
    ready = true;
  });

  client.on('auth_failure', msg => {
    console.error('[wa] auth failure', msg);
  });

  client.on('disconnected', reason => {
    console.log('[wa] disconnected', reason);
    ready = false;
  });

  // Emit incoming messages to the server via events emitter
  client.on('message', msg => {
    try {
      const from = msg.from || msg._data && msg._data.from;
      const body = msg.body || (msg._data && msg._data.body) || '';
      // attempt to extract interactive reply ids (buttons/list)
      const selectedButtonId = msg.selectedButtonId || msg._data?.selectedButtonId || (msg._data && msg._data.selectedButtonId) || null;
      const selectedRowId = msg.selectedRowId || msg._data?.selectedRowId || (msg._data && msg._data.selectedRowId) || null;
      // Normalize to JID form if needed
      let jid = from;
      if (jid && !jid.includes('@')) jid = `${jid}@s.whatsapp.net`;
      const emitted = { from: jid, text: body, raw: msg };
      if (selectedButtonId) emitted.selectedId = selectedButtonId;
      if (selectedRowId) emitted.selectedRowId = selectedRowId;
      events.emit('message', emitted);
    } catch (e) {
      console.error('[wa] message handler error', e?.message || e);
    }
  });

  client.initialize().catch(err => console.error('[wa] initialize error', err.message || err));
}

async function sendTextViaWA(to, text) {
  if (!client) throw new Error('WhatsApp client not initialized');
  if (!ready) throw new Error('WhatsApp client not ready. Scan QR or wait for connection.');
  let number = to;
  if (number.endsWith('@s.whatsapp.net')) number = number.split('@')[0];
  number = number.replace(/[^0-9]/g, '');
  if (!number.endsWith('@c.us')) number = `${number}@c.us`;
  const msg = await client.sendMessage(number, text);
  return msg;
}

async function sendButtonsViaWA(to, bodyText, buttonsArray, footer) {
  if (!client) throw new Error('WhatsApp client not initialized');
  if (!ready) throw new Error('WhatsApp client not ready. Scan QR or wait for connection.');
  let number = to;
  if (number.endsWith('@s.whatsapp.net')) number = number.split('@')[0];
  number = number.replace(/[^0-9]/g, '');
  if (!number.endsWith('@c.us')) number = `${number}@c.us`;

  // Map to simple button labels
  const buttonLabels = (buttonsArray || []).map((b) => (b.reply?.title || b.title || b.label || String(b)));

  // Map to objects expected by Buttons: { body: 'Label' }
  const buttonsForWA = buttonLabels.map(lbl => ({ body: String(lbl) }));
  // Use Buttons helper from whatsapp-web.js for proper interactivity
  // constructor: new Buttons(content, buttons, title, footer)
  const buttonsObj = new Buttons(bodyText || '', buttonsForWA, '', footer || '');
  const msg = await client.sendMessage(number, buttonsObj);
  return msg;
}

async function sendListViaWA(to, bodyText, buttonText, sections, title, footer) {
  if (!client) throw new Error('WhatsApp client not initialized');
  if (!ready) throw new Error('WhatsApp client not ready. Scan QR or wait for connection.');
  let number = to;
  if (number.endsWith('@s.whatsapp.net')) number = number.split('@')[0];
  number = number.replace(/[^0-9]/g, '');
  if (!number.endsWith('@c.us')) number = `${number}@c.us`;

  // Build rows for sections
  const builtSections = (sections || []).map((s) => ({
    title: s.title || '',
    rows: (s.rows || []).map((r) => ({ id: r.id || r.title, title: r.title, description: r.description || '' }))
  }));

  const list = new List(bodyText || '', buttonText || 'Ver opções', builtSections, title || '', footer || '');
  const msg = await client.sendMessage(number, list);
  return msg;
}

function isReady() { return ready; }

module.exports = { initWhatsAppClient, sendTextViaWA, sendButtonsViaWA, sendListViaWA, isReady, events };
