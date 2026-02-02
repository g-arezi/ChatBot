# Dra. Paula — Chatbot (Evolution API Bridge)

> Bridge entre a Evolution API e WhatsApp (fallback), implementado em Node.js com Express.

## Descrição

Este projeto expõe um webhook compatível com a Evolution API e provê fallback para envio via WhatsApp (usando `whatsapp-web.js`). Serve como camada de automação para o atendimento da Dra. Paula, implementando menu, detecção de emergência, logs e encaminhamento para atendimento humano.

## Principais arquivos

- `server.js`: servidor Express principal e lógica de processamento de mensagens.
- `whatsapp-client.js`: cliente WhatsApp (fallback) usado para enviar mensagens quando necessário.
- `db.json`: banco de dados simples em arquivo (lowdb).
- `Script.md`: textos e mensagens padrões usados pelo bot.
- `docker-compose.yml` / `Dockerfile`: arquivos para executar via Docker.

## Recursos

- Recebe webhooks de mensagens (rota `/webhook`).
- Envia mensagens para Evolution API e faz fallback para WhatsApp quando necessário.
- Detecta mensagens de emergência e notifica o administrativo por email.
- Armazena conversas e logs em `db.json`.
- Endpoints de administração: `/admin/conversations`, `/admin/logs`, `/admin/email-test`.

## Pré-requisitos

- Node.js 16+ e npm
- (Opcional) Docker & Docker Compose

## Instalação

1. Clone o repositório

```bash
git clone <repo-url>
cd "Chat Bot"
```

2. Instale dependências

```bash
npm install
```

3. Crie um arquivo `.env` com as variáveis necessárias (exemplo abaixo).

## Variáveis de ambiente

Configure um arquivo `.env` na raiz com pelo menos as variáveis abaixo:

- `PORT` — porta do servidor (ex: 3001)
- `EVOLUTION_API_BASE_URL` — base URL da Evolution API
- `EVOLUTION_API_KEY` — token da Evolution API
- `EVOLUTION_PHONE_ID` — ID do telefone/conta na Evolution (opcional)
- `ADMIN_EMAIL` — email administrativo para notificações
- `BUSINESS_TZ` — fuso horário (padrão `America/Sao_Paulo`)
- `BUSINESS_START_HOUR`, `BUSINESS_END_HOUR` — horário comercial (números inteiros)
- `ADMIN_API_KEY` — chave administrativa para endpoints protegidos (opcional)
- `EVOLUTION_WEBHOOK_SECRET` — segredo para validar webhooks (opcional)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `FROM_EMAIL` — configurações SMTP para envio de email

Exemplo mínimo de `.env`:

```env
PORT=3001
EVOLUTION_API_BASE_URL=https://api.evolution.example
EVOLUTION_API_KEY=your_evolution_key
ADMIN_EMAIL=seu@email.com
```

## Execução

- Em desenvolvimento (com nodemon):

```bash
npm run dev
```

- Em produção:

```bash
npm start
```

Ao iniciar, o servidor grava a porta usada em `server-port.txt`.

## Usando o WhatsApp fallback

O cliente fallback (`whatsapp-web.js`) exibirá um QR code no terminal na primeira inicialização. Escaneie-o com o celular para autenticar a sessão.

Se a Evolution API não estiver configurada, o sistema tentará enviar via WhatsApp automaticamente.

## Endpoints úteis

- `POST /webhook` — webhook para receber atualizações de mensagem (padrão JSON). Se `EVOLUTION_WEBHOOK_SECRET` estiver definido, a rota espera corpo raw e valida assinatura.
- `POST /send-text` — enviar texto via Evolution (ou fallback). Requer `x-admin-key` ou `ADMIN_API_KEY`.
- `GET /admin/conversations` — listar conversas (requer admin key).
- `GET /admin/logs` — listar logs (requer admin key).
- `POST /admin/email-test` — dispara email de teste (requer admin key).

## Banco de dados

Usa `lowdb` com armazenamento em arquivo (`db.json`). O formato guarda `conversations` e `logs`.

## Docker

Se preferir executar com Docker/Compose:

```bash
docker-compose up --build
```

## Contribuição

Abra issues e pull requests. Mantenha o escopo das alterações focado e adicione notas no `Script.md` quando alterar mensagens.

## Licença

MIT
