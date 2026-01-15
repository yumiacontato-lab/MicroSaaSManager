# Deploy na Vercel - Gerente de SaaS

Este guia explica como fazer deploy do projeto na Vercel.

## Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Projeto conectado no GitHub
3. Banco de dados PostgreSQL (recomendamos [Neon](https://neon.tech) ou [Supabase](https://supabase.com))

## Configuração

### 1. Banco de Dados

O projeto já está configurado para usar o Supabase PostgreSQL. A connection string está definida como variável de ambiente.

### 2. Variáveis de Ambiente

Configure as seguintes variáveis no dashboard da Vercel (Settings → Environment Variables):

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `DATABASE_URL` | Connection string PostgreSQL | ✅ Sim |
| `SESSION_SECRET` | Chave secreta para sessões | ✅ Sim |
| `DEMO_MODE` | Define como `true` para modo demo (sem auth) | Opcional |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID (para WhatsApp) | Opcional |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | Opcional |
| `TWILIO_PHONE_NUMBER` | Número WhatsApp do Twilio | Opcional |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe Public Key | Opcional |
| `STRIPE_SECRET_KEY` | Stripe Secret Key | Opcional |

### 3. Deploy

#### Via Vercel Dashboard:
1. Conecte seu repositório GitHub na Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

#### Via CLI:
```bash
# Instale a Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Para produção
vercel --prod
```

## Estrutura do Deploy

- **Frontend**: React/Vite → Build estático em `/dist/public`
- **Backend**: Serverless Functions → `/api/index.ts`

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/demo-login` | Login demo |
| GET | `/api/auth/user` | Dados do usuário |
| GET | `/api/subscriptions` | Listar assinaturas |
| POST | `/api/subscriptions` | Criar assinatura |
| PUT | `/api/subscriptions/:id` | Atualizar assinatura |
| DELETE | `/api/subscriptions/:id` | Deletar assinatura |
| GET | `/api/dashboard/stats` | Estatísticas do dashboard |
| GET | `/api/alerts` | Listar alertas WhatsApp |

## Autenticação

O projeto está configurado para usar autenticação baseada em token:

1. **Demo Mode**: Defina `DEMO_MODE=true` para bypass de autenticação
2. **Token Auth**: Use o endpoint `/api/auth/demo-login` para obter um token

### Exemplo de uso:
```javascript
// Login
const response = await fetch('/api/auth/demo-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', name: 'User Name' })
});
const { token } = await response.json();

// Usar token nas requisições
const subscriptions = await fetch('/api/subscriptions', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Troubleshooting

### Build falha
- Verifique se `DATABASE_URL` está configurada
- Execute `npm run build:vercel` localmente para testar

### API retorna 500
- Verifique os logs na Vercel Dashboard
- Confirme que as variáveis de ambiente estão corretas

### Frontend não carrega
- Limpe o cache do browser
- Verifique se o build foi concluído com sucesso

## Suporte

Para problemas, abra uma issue no repositório ou consulte a [documentação da Vercel](https://vercel.com/docs).
