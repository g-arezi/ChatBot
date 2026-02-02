# Informações para o fluxo
# função do copilot: Você irá criar esse fluxo completo, seguindo todos os passos a seguir com as informações citadas.
- utilizará n8n , com Evolution API
- todos botões funcionais
- siga todos os passos, para que eu precise somente implementar no n8n

-Siga o Script completo para criar o sistema

# 🤖 CHATBOT - DRA. PAULA TEIXEIRA PACHECO
## SCRIPT COMPLETO

**CRM-SP 205251**
**Atendimento:** 100% Online (Google Meet)
**Contato:** mentesfortes.psiquiatria@gmail.com

---

# 📱 ESTRUTURA DO CHATBOT

## ÍNDICE DE NAVEGAÇÃO
1. [Mensagem de Boas-Vindas](#mensagem-boas-vindas)
2. [Menu Principal](#menu-principal)
3. [Respostas Automáticas (Opções 1-5)](#respostas-automaticas)
4. [Atendimento com Secretária](#atendimento-secretaria)
5. [Tratamento de Emergências](#tratamento-emergencias)
6. [Mensagens Aleatórias (Gatilhos)](#mensagens-aleatorias)

---

<a name="mensagem-boas-vindas"></a>
# 🌟 MENSAGEM DE BOAS-VINDAS

**QUANDO ATIVAR:** Primeira mensagem que qualquer pessoa recebe ao contatar o WhatsApp

**GATILHO:** Primeiro contato / Palavra "olá", "oi", "bom dia", "boa tarde", "boa noite"

---

**TEXTO DA MENSAGEM:**

```
Olá! Seja muito bem-vindo(a)! 💙

Eu sou a Dra. Paula Teixeira Pacheco (CRM-SP 205251).

Acredito que tratar a mente é cuidar da alma inteira. Sim, a medicação pode ser necessária - ela acalma tempestades, equilibra neuroquímicos, traz alívio. Mas meu olhar vai além: vejo você como um ser completo, com história, emoções, sonhos e dores que pedem para serem compreendidas, não apenas silenciadas.

Integro neurociência, psicanálise, filosofia, budismo e estoicismo porque sei que a cura verdadeira acontece quando ciência e alma se encontram. Cada sintoma é um mensageiro - e juntos vamos decifrar o que ele tem a dizer.

✨ Aqui, você não é um diagnóstico. É um universo a ser compreendido.

Como posso ajudar você hoje? Escolha uma das opções abaixo:
```

**SEGUIR PARA:** Menu Principal

---

<a name="menu-principal"></a>
# 📋 MENU PRINCIPAL

**TIPO:** Botões interativos (Lista de opções)

**CONFIGURAÇÃO TÉCNICA:**
- Tipo de mensagem: Lista interativa (List Message)
- Título do botão: "Ver opções"
- Corpo da mensagem: (texto acima da mensagem de boas-vindas)

---

**OPÇÕES DO MENU:**

```
┌─────────────────────────────────────┐
│  1️⃣  Valores e Formas de Pagamento  │
├─────────────────────────────────────┤
│  2️⃣  Como funciona a Consulta      │
├─────────────────────────────────────┤
│  3️⃣  Hipnoterapia Clínica          │
├─────────────────────────────────────┤
│  4️⃣  Projeto Mentes Fortes          │
│      (Palestras)                    │
├─────────────────────────────────────┤
│  5️⃣  Política de Agendamento e      │
│      Cancelamento                    │
├─────────────────────────────────────┤
│  🆘  PRECISO DE AJUDA URGENTE      │
├─────────────────────────────────────┤
│  💬  Falar com a Secretária        │
│      (Seg-Sex, 9h-18h)              │
└─────────────────────────────────────┘
```

**GATILHOS PARA RETORNAR AO MENU:**
- Palavras: "menu", "voltar", "início", "opções"
- Botão: "⬅️ Voltar ao Menu Principal" (presente em todas as respostas)

---

<a name="respostas-automaticas"></a>
# 💬 RESPOSTAS AUTOMÁTICAS

---

## 1️⃣ VALORES E FORMAS DE PAGAMENTO

**GATILHO:** Usuário clica na opção 1 ou digita "valores", "preço", "quanto custa", "pagamento"

---

**TEXTO DA MENSAGEM:**

```
💰 VALORES DAS CONSULTAS:

🧑‍⚕️ Psiquiatria Adulto: R$ 500,00 
👶 Psiquiatria Infantil: R$ 600,00

💳 FORMAS DE PAGAMENTO:
• PIX (à vista)
• Cartão de crédito (até 2x com juros do cartão)

📌 COMO FUNCIONA O PAGAMENTO:
• 50% de sinal no agendamento
• 50% restantes até 24h antes da consulta

🏥 ATENDIMENTO:
• 100% Online (Google Meet)
• Não atendemos por planos de saúde
• Fornecemos recibo para reembolso

---

O que deseja fazer agora?
```

**BOTÕES DE NAVEGAÇÃO:**

```
┌──────────────────────────────┐
│  ⬅️  Voltar ao Menu Principal │
├──────────────────────────────┤
│  💬  Falar com a Secretária  │
└──────────────────────────────┘
```

---

## 2️⃣ COMO FUNCIONA A CONSULTA

**GATILHO:** Usuário clica na opção 2 ou digita "como funciona", "consulta", "atendimento"

---

**TEXTO DA MENSAGEM:**

```
🩺 COMO FUNCIONA A CONSULTA

⏰ DURAÇÃO: Aproximadamente 50 minutos
💻 FORMATO: 100% Online via Google Meet

Vamos conversar sobre:

📖 SUA HISTÓRIA:
• O que te trouxe até mim? Qual é sua dor?
• Sua trajetória de vida
• Momentos marcantes - traumas, perdas, transformações

💊 SEU HISTÓRICO DE TRATAMENTO:
• Já fez terapia ou tratamento psiquiátrico antes?
• Que medicações já usou? Como foi? Funcionou? Teve efeitos colaterais?
• O que já tentou e não deu certo?

🧭 NOSSO CAMINHO:
Juntos, vamos construir um caminho terapêutico que faça sentido para sua vida. Aqui, você encontrará não apenas o suporte medicamentoso quando necessário, mas um olhar integral que une psicologia, psicanálise, mindfulness, filosofia e espiritualidade — ferramentas que estudo constantemente para compreender você em sua totalidade e profundidade.

⚠️ IMPORTANTE SOBRE RETORNOS:
• Não trabalhamos com consultas de retorno
• Laudos, atestados e renovação de receitas requerem nova consulta

---

O que deseja fazer agora?
```

**BOTÕES DE NAVEGAÇÃO:**

```
┌──────────────────────────────┐
│  ⬅️  Voltar ao Menu Principal │
├──────────────────────────────┤
│  💬  Falar com a Secretária  │
└──────────────────────────────┘
```

---

## 3️⃣ HIPNOTERAPIA CLÍNICA

**GATILHO:** Usuário clica na opção 3 ou digita "hipnose", "hipnoterapia"

---

**TEXTO DA MENSAGEM:**

```
🌀 HIPNOTERAPIA CLÍNICA

Sabe aquela dor que você carrega há anos? Aquele medo que não tem explicação lógica? Aquele padrão destrutivo que você repete mesmo sabendo que te faz mal?

É lá, no seu inconsciente, que essas raízes estão plantadas.

A hipnoterapia é um caminho para chegar nessas profundezas - não para apagá-las, mas para ressignificá-las, integrá-las, transformá-las.

👉 É um trabalho delicado, profundo e transformador. Não é mágica. Não é espetáculo. É ciência com alma.

⚠️ Não prometo cura, mas sim um encontro verdadeiro com partes de você que pedem para serem vistas e acolhidas.

---

💰 COMO FUNCIONA:

✳️ 1ª ETAPA - Consulta de Avaliação (obrigatória)
⏰ Duração: 1 hora
💵 Valor: R$ 500 (adulto) ou R$ 600 (infantil)

Neste primeiro encontro:
• Preciso conhecer sua dor de perto
• Vou te explicar detalhadamente:
  - O que é Hipnoterapia de verdade (longe dos mitos)
  - Como funciona o processo
  - Riscos e benefícios reais
  - Se há indicação para o seu caso específico

Este é um tempo dedicado inteiramente a você. Por isso, o valor não é reembolsável caso decida não seguir.

✳️ 2ª ETAPA - Sessões (se indicado e você escolher)
💵 Valor: R$ 3.000,00 (tratamento completo)
📅 Formato: Geralmente 4 sessões de 1h a 1h30
🔄 Frequência: 1 sessão por semana
💳 Pagamento: Cartão de crédito (até 5x com juros do cartão)

---

O que deseja fazer agora?
```

**BOTÕES DE NAVEGAÇÃO:**

```
┌──────────────────────────────┐
│  ⬅️  Voltar ao Menu Principal │
├──────────────────────────────┤
│  💬  Falar com a Secretária  │
└──────────────────────────────┘
```

---

## 4️⃣ PROJETO MENTES FORTES

**GATILHO:** Usuário clica na opção 4 ou digita "mentes fortes", "palestra", "projeto"

---

**TEXTO DA MENSAGEM:**

```
🧠 PROJETO MENTES FORTES

Vivemos uma epidemia silenciosa de adoecimento mental. E a resposta não está apenas em tratar quem já adoeceu - está em prevenir, educar, fortalecer.

Todos os dias atendo pessoas que chegam ao meu consultório tarde demais - depois que a ansiedade já tomou conta, depois que a depressão já se instalou, depois que os padrões destrutivos já estão enraizados.

📌 O Projeto Mentes Fortes leva para escolas, empresas e instituições ferramentas reais de saúde mental - não discursos vazios de autoajuda, mas conhecimento científico integrado à sabedoria prática.

---

🎯 PARA QUEM É:

🔷️ ADULTOS:
Não é palestra motivacional. É compreensão profunda sobre ansiedade, relacionamentos, sentido existencial - com ferramentas que funcionam de verdade.

🔷️ PAIS E EDUCADORES:
Como criar filhos emocionalmente inteligentes, resilientes e preparados para os desafios reais - longe das ilusões da "psicologia positiva" que falha.

É educação em saúde mental que transforma, não que apenas informa.

---

📧 QUER SABER MAIS SOBRE CONTEÚDO, FORMATO E VALORES?

Entre em contato:
📩 mentesfortes.psiquiatria@gmail.com

📱 Siga nosso trabalho:
👨‍👩‍👧 Para pais e educadores: @projetomentesfortes_
🧑‍⚕️ Para adultos: @projetomenteforte_psiquiatria

Cada projeto é único, construído com cuidado para sua realidade. 💙

---

O que deseja fazer agora?
```

**BOTÕES DE NAVEGAÇÃO:**

```
┌──────────────────────────────┐
│  ⬅️  Voltar ao Menu Principal │
├──────────────────────────────┤
│  💬  Falar com a Secretária  │
└──────────────────────────────┘
```

---

## 5️⃣ POLÍTICA DE AGENDAMENTO E CANCELAMENTO

**GATILHO:** Usuário clica na opção 5 ou digita "agendamento", "cancelamento", "remarcar"

---

**TEXTO DA MENSAGEM:**

```
📅 POLÍTICA DE AGENDAMENTO E CANCELAMENTO

Consultas são agendadas diretamente com nossa secretária. Solicite um horário e ela verificará a disponibilidade, informará valores e solicitará o sinal para confirmação.

---

💰 AGENDAMENTO:

📌 SINAL (50% do valor):
• Pago no momento do agendamento
• PIX ou cartão de crédito (até 2x com juros)

📌 RESTANTE (50% do valor):
• Pago até 24h antes da consulta
• PIX ou cartão de crédito (até 2x com juros)

---

🔄 CANCELAMENTO:

✅ COM 72h (3 DIAS) DE ANTECEDÊNCIA:
• Sem multa
• Valor pago vira crédito para reagendar

❌ COM MENOS DE 72h:
• Perda total do valor pago
• Sem possibilidade de reembolso ou crédito

---

O que deseja fazer agora?
```

**BOTÕES DE NAVEGAÇÃO:**

```
┌──────────────────────────────┐
│  ⬅️  Voltar ao Menu Principal │
├──────────────────────────────┤
│  💬  Falar com a Secretária  │
└──────────────────────────────┘
```

---

<a name="tratamento-emergencias"></a>
# 🆘 TRATAMENTO DE EMERGÊNCIAS

**GATILHO:**
- Usuário clica em "🆘 PRECISO DE AJUDA URGENTE"
- OU digita palavras-chave de crise (ver lista abaixo)

**PALAVRAS-CHAVE QUE ATIVAM ALERTA DE EMERGÊNCIA:**
- "suicídio", "suicida", "me matar", "matar"
- "morrer", "morte", "acabar com tudo"
- "não aguento mais", "desespero", "desesperad"
- "crise", "emergência", "urgente", "socorro"
- "vou pular", "vou me jogar"

---

**TEXTO DA MENSAGEM:**

```
🆘 EMERGÊNCIA - AJUDA IMEDIATA

Se você está em crise ou risco imediato, precisa de ajuda AGORA:

📞 CVV - Centro de Valorização da Vida
Ligue: 188 (24 horas, gratuito)
Chat: www.cvv.org.br

🚨 SAMU - Serviço de Atendimento Móvel de Urgência
Ligue: 192

🏥 PRONTO-SOCORRO PSIQUIÁTRICO
Procure o hospital de emergência psiquiátrica mais próximo de você agora.

---

⚠️ IMPORTANTE:

Nossa consulta online NÃO substitui atendimento de emergência.

Se você está em risco imediato, por favor, busque ajuda presencial urgente ou ligue para os números acima.

💙 Você não está sozinho(a). A vida vale a pena. Procure ajuda agora.

---

Se esta não é uma emergência e você gostaria de agendar uma consulta, fale com nossa secretária.
```

**BOTÕES DE NAVEGAÇÃO:**

```
┌──────────────────────────────┐
│  💬  Falar com a Secretária  │
├──────────────────────────────┤
│  ⬅️  Voltar ao Menu Principal │
└──────────────────────────────┘
```

**AÇÃO ADICIONAL:**
- Notificar a secretária/você imediatamente sobre a mensagem de emergência
- Registrar o número para acompanhamento

---

<a name="atendimento-secretaria"></a>
# 💬 ATENDIMENTO COM SECRETÁRIA

## OPÇÃO A: Durante Horário Comercial

**HORÁRIO:** Segunda a Sexta, 9h às 18h

**GATILHO:** Usuário clica em "💬 Falar com a Secretária" dentro do horário

---

**TEXTO DA MENSAGEM:**

```
Ótimo! Vou te transferir para atendimento humano agora! 😊

Nossa secretária está disponível e vai te atender com todo carinho!

Aguarde um momento...
```

**AÇÃO TÉCNICA:**
- Transferir conversa para atendente humano
- Notificar secretária da transferência
- Incluir histórico da conversa (qual opção o usuário escolheu antes)

---

## OPÇÃO B: Fora do Horário Comercial

**HORÁRIO:** Segunda a Sexta após 18h, finais de semana e feriados

**GATILHO:** Usuário clica em "💬 Falar com a Secretária" fora do horário

---

**TEXTO DA MENSAGEM:**

```
Obrigada pelo contato! 💙

No momento estamos fora do horário de atendimento.

📅 NOSSO HORÁRIO:
Segunda a Sexta, das 9h às 18h

---

O QUE VOCÊ PODE FAZER:

1️⃣ DEIXAR UMA MENSAGEM:
Deixe seu nome, telefone e motivo do contato.
Retornaremos no próximo dia útil!

2️⃣ VOLTAR AMANHÃ:
Estaremos disponíveis a partir das 9h!

---

Deseja deixar uma mensagem?
```

**BOTÕES DE NAVEGAÇÃO:**

```
┌──────────────────────────────┐
│  ✅  Sim, quero deixar msg    │
├──────────────────────────────┤
│  ⬅️  Voltar ao Menu Principal │
└──────────────────────────────┘
```

---

## OPÇÃO C: Usuário Escolhe Deixar Mensagem

**GATILHO:** Usuário clica em "✅ Sim, quero deixar msg"

---

**TEXTO DA MENSAGEM:**

```
Perfeito! Por favor, envie sua mensagem com:

📝 Seu nome completo:
📱 Seu telefone:
💬 Motivo do contato:

Pode escrever tudo em uma única mensagem ou separado.

Retornaremos assim que possível! 💙
```

**AÇÃO TÉCNICA:**
- Salvar próxima mensagem do usuário como "mensagem deixada"
- Notificar secretária por email/sistema
- Após receber a mensagem, enviar confirmação:

```
Mensagem recebida! ✅

Obrigada! Retornaremos em breve.

Tenha um ótimo dia/noite! 💙
Dra. Paula Teixeira Pacheco
```

---

<a name="mensagens-aleatorias"></a>
# 🔄 TRATAMENTO DE MENSAGENS ALEATÓRIAS

**O QUE SÃO:** Mensagens que o usuário envia fora do menu (texto livre)

---

## CATEGORIAS E RESPOSTAS:

### 1️⃣ SAUDAÇÕES SIMPLES

**GATILHOS:** "oi", "olá", "opa", "hey", "bom dia", "boa tarde", "boa noite"

**RESPOSTA:**
```
Olá! 😊

Para te ajudar melhor, escolha uma das opções abaixo:
```
**AÇÃO:** Mostrar Menu Principal

---

### 2️⃣ AGRADECIMENTOS

**GATILHOS:** "obrigado", "obrigada", "valeu", "thanks"

**RESPOSTA:**
```
Por nada! 💙 Estou aqui para ajudar.

Precisa de mais alguma informação?
```
**AÇÃO:** Mostrar Menu Principal

---

### 3️⃣ PERGUNTAS SOBRE LOCALIZAÇÃO

**GATILHOS:** "onde fica", "endereço", "local", "clínica"

**RESPOSTA:**
```
Meu atendimento é 100% online via Google Meet! 💻

Você pode estar onde quiser - em casa, no trabalho, em qualquer lugar com internet.

Gostaria de saber mais sobre como funciona a consulta online?
```

**BOTÕES:**
```
┌──────────────────────────────┐
│  2️⃣  Como funciona a Consulta │
├──────────────────────────────┤
│  💬  Falar com a Secretária  │
├──────────────────────────────┤
│  ⬅️  Voltar ao Menu Principal │
└──────────────────────────────┘
```

---

### 4️⃣ PERGUNTAS SOBRE DISPONIBILIDADE

**GATILHOS:** "horário", "quando", "disponível", "agenda", "vaga"

**RESPOSTA:**
```
Para verificar horários disponíveis e agendar sua consulta, nossa secretária pode te ajudar! 😊

Ela está disponível de segunda a sexta, das 9h às 18h.

Gostaria de falar com ela agora?
```

**BOTÕES:**
```
┌──────────────────────────────┐
│  💬  Sim, falar com Secretária │
├──────────────────────────────┤
│  ⬅️  Voltar ao Menu Principal  │
└──────────────────────────────┘
```

---

### 5️⃣ PERGUNTAS CLÍNICAS/DIAGNÓSTICOS

**GATILHOS:** "ansiedade", "depressão", "pânico", "remédio", "medicação", "diagnóstico", "tratamento"

**RESPOSTA:**
```
Entendo sua preocupação. 💙

Questões clínicas precisam ser avaliadas em consulta, onde posso conhecer sua história completa e te ajudar da melhor forma.

Gostaria de saber como funciona a consulta ou já prefere falar com a secretária para agendar?
```

**BOTÕES:**
```
┌──────────────────────────────┐
│  2️⃣  Como funciona a Consulta │
├──────────────────────────────┤
│  💬  Falar com a Secretária  │
├──────────────────────────────┤
│  ⬅️  Voltar ao Menu Principal │
└──────────────────────────────┘
```

---

### 6️⃣ MENSAGENS NÃO RECONHECIDAS

**QUANDO:** Qualquer mensagem que não se encaixa nas categorias acima

**RESPOSTA:**
```
Desculpe, não entendi sua mensagem. 😊

Para te ajudar melhor, escolha uma das opções do menu:
```
**AÇÃO:** Mostrar Menu Principal

---

### 7️⃣ MENSAGENS DE FRUSTRAÇÃO/RECLAMAÇÃO

**GATILHOS:** "não funciona", "não entendi", "complicado", "difícil"

**RESPOSTA:**
```
Peço desculpas se algo não ficou claro! 💙

Nossa secretária pode te ajudar pessoalmente a esclarecer qualquer dúvida.

Gostaria de falar com ela?
```

**BOTÕES:**
```
┌──────────────────────────────┐
│  💬  Sim, falar com Secretária │
├──────────────────────────────┤
│  ⬅️  Voltar ao Menu Principal  │
└──────────────────────────────┘
```

---

# 📊 FLUXOGRAMA SIMPLIFICADO

```
INÍCIO
  ↓
[Primeira mensagem] → Boas-vindas + Menu Principal
  ↓
[Usuário escolhe opção 1-5] → Resposta específica
  ↓
[Botão "Voltar"] → Menu Principal
  ↓
[Botão "Secretária"] → Verifica horário
  ↓
├─ [Horário comercial] → Transfere para humano
└─ [Fora de horário] → Opção deixar mensagem
  ↓
[Palavras de emergência] → Alerta + CVV/SAMU
  ↓
[Mensagem aleatória] → Tratamento específico → Menu
```

---

# ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Configurar mensagem de boas-vindas
- [ ] Criar menu principal com botões interativos
- [ ] Programar 5 respostas automáticas (opções 1-5)
- [ ] Configurar alerta de emergência com palavras-chave
- [ ] Programar verificação de horário comercial
- [ ] Criar fluxo de transferência para secretária
- [ ] Configurar captura de mensagem fora de horário
- [ ] Programar tratamento de mensagens aleatórias (7 categorias)
- [ ] Testar todos os botões de navegação
- [ ] Testar gatilhos de palavras-chave
- [ ] Configurar notificações para emergências
- [ ] Configurar notificações de mensagens deixadas

---

**FIM DO SCRIPT COMPLETO**

💙 Dra. Paula Teixeira Pacheco - CRM-SP 205251


# 📊 FLUXOGRAMA VISUAL DO CHATBOT
## DRA. PAULA TEIXEIRA PACHECO

**Objetivo:** Visualizar todos os caminhos possíveis do chatbot de forma clara

---

# 🗺️ MAPA COMPLETO DE NAVEGAÇÃO

```
                                    INÍCIO
                                      │
                                      ▼
                    ┌─────────────────────────────────┐
                    │  USUÁRIO ENVIA 1ª MENSAGEM    │
                    └────────────┬────────────────────┘
                                │
                    ┌────────────┴────────────┐
                    │                        │
          ┌─────────▼─────────┐    ┌─────────▼──────────┐
          │  Contém palavra  │    │  Não contém      │
          │  de EMERGÊNCIA?  │    │  emergência      │
          └─────────┬─────────┘    └─────────┬──────────┘
                    │ SIM                    │ NÃO
                    │                        │
          ┌─────────▼─────────┐              │
          │  🆘 ALERTA        │              │
          │  EMERGÊNCIA      │              │
          │                  │              │
          │  • CVV: 188      │              │
          │  • SAMU: 192      │              │
          │  • PS Psiquiátrico│              │
          │                  │              │
          │  [Notifica Dra.]  │              │
          └─────────┬─────────┘              │
                    │                        │
                    └────────────┬────────────┘
                                │
                                ▼
                    ┌─────────────────────────────────┐
                    │  💙 MENSAGEM DE BOAS-VINDAS    │
                    │                                │
                    │  Apresentação da Dra. Paula    │
                    │  + Filosofia de trabalho        │
                    └────────────┬────────────────────┘
                                │
                                ▼
                    ┌─────────────────────────────────┐
                    │      📋 MENU PRINCIPAL        │
                    │                                │
                    │  1️⃣  Valores                    │
                    │  2️⃣  Como funciona              │
                    │  3️⃣  Hipnoterapia              │
                    │  4️⃣  Projeto Mentes Fortes      │
                    │  5️⃣  Agendamento                │
                    │  🆘  Ajuda Urgente              │
                    │  💬  Falar com Secretária      │
                    └──┬──┬──┬──┬──┬──┬──────────────┘
                      │  │  │  │  │  │
      ┌───────────────┘  │  │  │  │  └────────────────────┐
      │  ┌────────────────┘  │  │  └─────────────┐        │
      │  │  ┌─────────────────┘  └────────┐      │        │
      │  │  │  ┌──────────────────────┐  │      │        │
      │  │  │  │                      │  │      │        │
      ▼  ▼  ▼  ▼                      ▼  ▼      ▼        ▼
    ┌──┐┌──┐┌──┐┌──┐                ┌──┐┌──┐  ┌──┐  ┌────────┐
    │1 ││2 ││3 ││4 │                │5 ││🆘│  │💬│  │ MENSAGEM│
    │  ││  ││  ││  │                │  ││  │  │  │  │ ALEATÓRIA│
    └┬─┘└┬─┘└┬─┘└┬─┘                └┬─┘└──┘  └┬─┘  └───┬────┘
      │  │  │  │                  │          │        │
      │  │  │  │                  │          │        │
      └───┴───┴───┴───────────────────┴───────────┴─────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  BOTÕES DE NAVEGAÇÃO  │
              │                        │
              │  ⬅️  Voltar ao Menu    │
              │  💬  Falar c/ Secretária│
              └─────────────────────────┘
```

---

# 🔀 DETALHAMENTO DOS CAMINHOS

## CAMINHO 1: VALORES E PAGAMENTO

```
[USUÁRIO]
  ↓ Clica "1️⃣ Valores"
  ↓ OU digita "valores", "preço", "quanto custa"
  ↓
[BOT]
  ↓ Exibe:
  ↓ • Psiquiatria Adulto: R$ 500
  ↓ • Psiquiatria Infantil: R$ 600
  ↓ • Formas de pagamento (PIX, cartão)
  ↓ • Informações sobre 50% + 50%
  ↓
  ↓ Oferece:
  ↓ [⬅️ Voltar ao Menu] [💬 Falar com Secretária]
  ↓
[USUÁRIO escolhe próxima ação]
```

---

## CAMINHO 2: COMO FUNCIONA A CONSULTA

```
[USUÁRIO]
  ↓ Clica "2️⃣ Como funciona"
  ↓ OU digita "consulta", "como funciona"
  ↓
[BOT]
  ↓ Exibe:
  ↓ • Duração: 50min
  ↓ • Formato: Online (Google Meet)
  ↓ • O que será conversado
  ↓ • Informação sobre retornos
  ↓
  ↓ Oferece:
  ↓ [⬅️ Voltar ao Menu] [💬 Falar com Secretária]
  ↓
[USUÁRIO escolhe próxima ação]
```

---

## CAMINHO 3: HIPNOTERAPIA CLÍNICA

```
[USUÁRIO]
  ↓ Clica "3️⃣ Hipnoterapia"
  ↓ OU digita "hipnose", "hipnoterapia"
  ↓
[BOT]
  ↓ Exibe:
  ↓ • Explicação sobre hipnoterapia
  ↓ • 1ª Etapa: Avaliação (R$ 500/600)
  ↓ • 2ª Etapa: Tratamento (R$ 3.000 - 4 sessões)
  ↓
  ↓ Oferece:
  ↓ [⬅️ Voltar ao Menu] [💬 Falar com Secretária]
  ↓
[USUÁRIO escolhe próxima ação]
```

---

## CAMINHO 4: PROJETO MENTES FORTES

```
[USUÁRIO]
  ↓ Clica "4️⃣ Projeto Mentes Fortes"
  ↓ OU digita "palestra", "projeto", "mentes fortes"
  ↓
[BOT]
  ↓ Exibe:
  ↓ • Descrição do projeto
  ↓ • Públicos: adultos, pais/educadores
  ↓ • Email: mentesfortes.psiquiatria@gmail.com
  ↓ • Instagrams
  ↓
  ↓ Oferece:
  ↓ [⬅️ Voltar ao Menu] [💬 Falar com Secretária]
  ↓
[USUÁRIO escolhe próxima ação]
```

---

## CAMINHO 5: POLÍTICA DE AGENDAMENTO

```
[USUÁRIO]
  ↓ Clica "5️⃣ Agendamento"
  ↓ OU digita "agendar", "cancelar", "remarcar"
  ↓
[BOT]
  ↓ Exibe:
  ↓ • Como funciona o pagamento (50% + 50%)
  ↓ • Política de cancelamento:
  ↓  - 72h antes: sem multa, vira crédito
  ↓  - Menos 72h: perda total
  ↓
  ↓ Oferece:
  ↓ [⬅️ Voltar ao Menu] [💬 Falar com Secretária]
  ↓
[USUÁRIO escolhe próxima ação]
```

---

## CAMINHO 6: EMERGÊNCIA (PRIORITÁRIO)

```
[USUÁRIO]
  ↓ Clica "🆘 Ajuda Urgente"
  ↓ OU digita palavra de crise:
  ↓ "suicídio", "me matar", "não aguento mais"
  ↓
[BOT]
  ↓ ⚡ INTERROMPE QUALQUER FLUXO
  ↓
  ↓ Exibe IMEDIATAMENTE:
  ↓ • 🆘 ALERTA DE EMERGÊNCIA
  ↓ • CVV: 188 (24h)
  ↓ • SAMU: 192
  ↓ • Orientação para PS psiquiátrico
  ↓
  ↓ [SISTEMA]
  ↓ • Envia email URGENTE para Dra. Paula
  ↓ • Envia SMS de alerta (opcional)
  ↓ • Registra log de emergência
  ↓ • Marca conversa como prioritária
  ↓
  ↓ Oferece:
  ↓ [💬 Falar com Secretária] [⬅️ Voltar ao Menu]
  ↓
[USUÁRIO escolhe próxima ação]
```

---

## CAMINHO 7: FALAR COM SECRETÁRIA

### 7A: DENTRO DO HORÁRIO (Seg-Sex, 9h-18h)

```
[USUÁRIO]
  ↓ Clica "💬 Falar com Secretária"
  ↓
[BOT]
  ↓ Verifica horário atual
  ↓ É dia útil? SIM
  ↓ É entre 9h-18h? SIM
  ↓
  ↓ Exibe:
  ↓ "Vou te transferir agora! 😊"
  ↓
  ↓ [SISTEMA]
  ↓ • Transfere para atendente humano
  ↓ • Desativa bot para este número
  ↓ • Envia histórico da conversa
  ↓ • Notifica secretária
  ↓
[SECRETÁRIA assume conversa]
```

---

### 7B: FORA DO HORÁRIO

```
[USUÁRIO]
  ↓ Clica "💬 Falar com Secretária"
  ↓
[BOT]
  ↓ Verifica horário atual
  ↓ É fim de semana? SIM
  ↓ OU É após 18h? SIM
  ↓ OU É antes 9h? SIM
  ↓
  ↓ Exibe:
  ↓ "Estamos fora do horário"
  ↓ "Nosso horário: Seg-Sex, 9h-18h"
  ↓
  ↓ Oferece:
  ↓ [✅ Deixar mensagem] [⬅️ Voltar ao Menu]
  ↓
[USUÁRIO escolhe]
      │
      ├─ Clica "Deixar mensagem"
      │    ↓
      │    [BOT] "Envie: nome, telefone, motivo"
      │    ↓
      │    [USUÁRIO] Envia dados
      │    ↓
      │    [SISTEMA]
      │    • Salva mensagem
      │    • Envia email para secretária
      │    • Confirma: "Mensagem recebida! ✅"
      │
      └─ Clica "Voltar ao Menu"
            ↓
            [Retorna ao Menu Principal]
```

---

## CAMINHO 8: MENSAGENS ALEATÓRIAS

### 8A: Saudações

```
[USUÁRIO] "oi" / "olá" / "bom dia"
  ↓
[BOT] "Olá! 😊 Para te ajudar melhor..."
  ↓ [Exibe Menu Principal]
```

### 8B: Agradecimentos

```
[USUÁRIO] "obrigado" / "valeu"
  ↓
[BOT] "Por nada! 💙 Precisa de mais alguma informação?"
  ↓ [Exibe Menu Principal]
```

### 8C: Perguntas sobre localização

```
[USUÁRIO] "onde fica" / "endereço"
  ↓
[BOT] "Meu atendimento é 100% online via Google Meet!"
  ↓ Oferece:
  ↓ [2️⃣ Como funciona] [💬 Secretária] [⬅️ Menu]
```

### 8D: Perguntas sobre horário/vaga

```
[USUÁRIO] "horário" / "vaga" / "disponível"
  ↓
[BOT] "Para verificar horários, nossa secretária pode ajudar!"
  ↓ Oferece:
  ↓ [💬 Falar com Secretária] [⬅️ Menu]
```

### 8E: Perguntas clínicas

```
[USUÁRIO] "ansiedade" / "depressão" / "remédio"
  ↓
[BOT] "Questões clínicas precisam ser avaliadas em consulta..."
  ↓ Oferece:
  ↓ [2️⃣ Como funciona] [💬 Secretária] [⬅️ Menu]
```

### 8F: Mensagem não reconhecida

```
[USUÁRIO] "xpto123" (qualquer coisa não mapeada)
  ↓
[BOT] "Desculpe, não entendi. Para te ajudar melhor..."
  ↓ [Exibe Menu Principal]
```

---

# 🎯 MATRIZ DE DECISÃO RÁPIDA

| Se usuário fizer... | Bot faz... |
|---------------------|-----------|
| Primeira mensagem | Boas-vindas + Menu |
| Digita palavra de emergência | ⚡ Alerta CVV/SAMU + notifica Dra. |
| Clica opção 1-5 | Exibe resposta + botões navegação |
| Clica "Secretária" (9h-18h seg-sex) | Transfere para humano |
| Clica "Secretária" (fora horário) | Oferece deixar mensagem |
| Digita "menu", "voltar" | Volta ao Menu Principal |
| Digita palavra-chave (valores, consulta...) | Vai direto para opção correspondente |
| Digita algo não reconhecido | Mensagem padrão + Menu |

---

# 🔄 CICLOS COMUNS DE USO

## CICLO 1: Pesquisa de Informações

```
Usuário entra
  ↓
Boas-vindas
  ↓
Opção 1 (Valores) → Volta menu
  ↓
Opção 2 (Consulta) → Volta menu
  ↓
Fala com Secretária → Agenda
```

---

## CICLO 2: Interesse Direto

```
Usuário entra
  ↓
Boas-vindas
  ↓
Fala com Secretária → Agenda
```

---

## CICLO 3: Emergência

```
Usuário entra
  ↓
Mensagem de crise
  ↓
⚡ Alerta CVV/SAMU
  ↓
[Dra. Paula notificada]
  ↓
Usuário pode escolher:
├─ Falar com Secretária
└─ Voltar ao Menu
```

---

## CICLO 4: Fora de Horário

```
Usuário entra (sábado)
  ↓
Boas-vindas
  ↓
Fala com Secretária
  ↓
"Fora do horário"
  ↓
Deixa mensagem
  ↓
[Secretária recebe email]
  ↓
"Retornaremos!"
```

---

# 📊 ESTATÍSTICAS ÚTEIS PARA MONITORAR

## Métricas Importantes:

1. **Taxa de conversão para agendamento**
- Quantos usuários → Falam com secretária
- Meta: > 30%

2. **Opções mais acessadas**
- Qual opção (1-5) é mais clicada
- Ajustar conteúdo baseado nisso

3. **Horário de pico**
- Quando mais pessoas entram em contato
- Garantir secretária disponível nesses horários

4. **Taxa de emergência**
- Quantos alertas de emergência por semana
- Monitorar para possível ajuste de palavras-chave

5. **Mensagens fora de horário**
- Quantas pessoas deixam mensagem
- Considerar expandir horário se muitas

6. **Taxa de abandono**
- Quantos entram mas não escolhem nada
- Melhorar boas-vindas se alta

---

# 🎨 VISUALIZAÇÃO POR PERSONA

## PERSONA 1: Maria, 35 anos, Ansiedade

```
[Maria] Olá, preciso de ajuda com ansiedade
  ↓
[Bot] Boas-vindas + Menu
  ↓
[Maria] [Clica: Como funciona]
  ↓
[Bot] Explica consulta online, 50min, etc
  ↓
[Maria] [Clica: Valores]
  ↓
[Bot] R$ 500, PIX/cartão
  ↓
[Maria] [Clica: Falar com Secretária]
  ↓
[Bot] [Transfere - é 14h de terça]
  ↓
[Secretária] Olá Maria! Vi que você quer saber sobre ansiedade...
  ↓
[Agendamento realizado] ✅
```

---

## PERSONA 2: João, 45 anos, Empresa quer palestra

```
[João] Bom dia, gostaria de palestra sobre saúde mental
  ↓
[Bot] Boas-vindas + Menu
  ↓
[João] [Clica: Projeto Mentes Fortes]
  ↓
[Bot] Explica projeto, público, mostra email
  ↓
[João] [Anota email: mentesfortes.psiquiatria@gmail.com]
  ↓
[João] Obrigado!
  ↓
[Bot] Por nada! 💙
  ↓
[João envia email posteriormente] ✅
```

---

## PERSONA 3: Ana, 28 anos, Crise (Emergência)

```
[Ana] Não aguento mais, quero acabar com tudo
  ↓
[Bot] ⚡ DETECTA EMERGÊNCIA
  ↓
[Bot] 🆘 ALERTA IMEDIATO
      CVV: 188
      SAMU: 192
      Procure PS agora!
  ↓
[SISTEMA] 📧 Email URGENTE para Dra. Paula
          "Emergência detectada de +5511..."
  ↓
[Ana] [Vê informações de ajuda]
  ↓
[Ana] [Pode ligar CVV ou falar com secretária]
  ↓
[Dra. Paula] [Recebe alerta, pode tentar contato direto]
```

---

## PERSONA 4: Carlos, sábado 15h, quer agendar

```
[Carlos] Olá, gostaria de agendar consulta
  ↓
[Bot] Boas-vindas + Menu
  ↓
[Carlos] [Clica: Falar com Secretária]
  ↓
[Bot] Verifica: É sábado 15h → FORA do horário
  ↓
[Bot] "Estamos fora do horário. Seg-Sex 9h-18h"
      Opções:
      [✅ Deixar mensagem] [⬅️ Menu]
  ↓
[Carlos] [Clica: Deixar mensagem]
  ↓
[Bot] "Envie: nome, telefone, motivo"
  ↓
[Carlos] "Carlos Silva, 11999999999, gostaria de agendar consulta"
  ↓
[SISTEMA] 📧 Email para secretária
  ↓
[Bot] "Mensagem recebida! ✅ Retornaremos segunda!"
  ↓
[Segunda 9h] [Secretária vê email, liga para Carlos] ✅
```

---

# 🚦 SEMÁFORO DE PRIORIDADES

## 🔴 PRIORIDADE MÁXIMA (Interrompe tudo)
- Palavras de emergência
- Risco de vida
- Ação: Alerta imediato + notificação Dra.

## 🟡 PRIORIDADE ALTA (Processar rapidamente)
- Falar com secretária (dentro horário)
- Ação: Transferir para humano

## 🟢 PRIORIDADE NORMAL (Fluxo padrão)
- Opções 1-5 do menu
- Navegação
- Ação: Resposta automática

## ⚪ PRIORIDADE BAIXA (Informativo)
- Agradecimentos
- Saudações
- Ação: Resposta educada + menu

---

# 📱 EXEMPLO DE CONVERSA COMPLETA REAL

```
┌─────────────────────────────────────────────────┐
│  CONVERSA EXEMPLO: Luciana (paciente nova)      │
└─────────────────────────────────────────────────┘

[10:30] Luciana: Oi

[10:30] Bot: Olá! Seja muito bem-vindo(a)! 💙
           
            Eu sou a Dra. Paula Teixeira Pacheco (CRM-SP 205251).
           
            Acredito que tratar a mente é cuidar da alma inteira...
            [mensagem completa de boas-vindas]
           
            [MENU com 7 opções]

[10:32] Luciana: [Clica: 2️⃣ Como funciona]

[10:32] Bot: 🩺 COMO FUNCIONA A CONSULTA
           
            ⏰ DURAÇÃO: Aproximadamente 50 minutos
            💻 FORMATO: 100% Online via Google Meet
           
            Vamos conversar sobre...
            [mensagem completa]
           
            [Botões: Voltar Menu | Secretária]

[10:35] Luciana: Achei interessante. Quanto custa?

[10:35] Bot: 💰 VALORES DAS CONSULTAS:
           
            🧑‍⚕️ Psiquiatria Adulto: R$ 500,00
            ...
            [mensagem completa de valores]
           
            [Botões: Voltar Menu | Secretária]

[10:37] Luciana: Perfeito. Posso agendar?

[10:37] Bot: [Detecta palavra "agendar"]
           
            Para verificar horários disponíveis...
            [mensagem sobre secretária]
           
            [Botão: Falar com Secretária]

[10:38] Luciana: [Clica: Falar com Secretária]

[10:38] Bot: [Verifica: terça 10:38h = DENTRO do horário]
           
            Ótimo! Vou te transferir agora! 😊
            Aguarde um momento...
           
            [TRANSFERE para secretária]

[10:38] Secretária: Olá Luciana! Tudo bem?
                    Vi que você quer agendar uma consulta.
                    Vamos ver as datas disponíveis!

[10:40] Luciana: Sim! Prefiro tarde se tiver

[10:42] Secretária: Temos vaga na quinta às 15h. Serve?

[10:43] Luciana: Perfeito!

[10:45] Secretária: Ótimo! Vou te enviar o link de pagamento...

┌─────────────────────────────────────────────────┐
│  ✅ AGENDAMENTO REALIZADO COM SUCESSO          │
│  Tempo total: 15 minutos                        │
│  Conversão: SIM                                │
│  Experiência: Fluida e humanizada              │
└─────────────────────────────────────────────────┘
```

---

**FIM DO FLUXOGRAMA VISUAL**

💙 Dra. Paula Teixeira Pacheco - CRM-SP 205251

---




