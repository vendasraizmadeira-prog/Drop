# Drop Store — Camisetas por Encomenda

Web app completo para venda de camisetas por pré-venda com pagamento PIX.

## Stack

- **Next.js 14** (App Router + TypeScript)
- **Tailwind CSS** + componentes Shadcn/ui inline
- **Supabase** (PostgreSQL + SSR)
- **react-qr-code** — QR Code PIX real (padrão EMV BR.GOV.BCB.PIX)
- **sonner** — Toasts
- **jose** — JWT para sessão admin
- **Lucide Icons**

---

## Instalação

### 1. Clone e instale dependências

```bash
cd C:\Users\pedro\Desktop\tshirt-shop
npm install
```

### 2. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **SQL Editor** e execute em ordem:
   - `supabase/schema.sql`
   - `supabase/seed.sql`
3. Copie as credenciais em **Project Settings → API**

> **Importante para desenvolvimento:** Para evitar problemas de RLS com a `anon key`,
> execute no SQL Editor:
> ```sql
> ALTER TABLE products DISABLE ROW LEVEL SECURITY;
> ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
> ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
> ```

### 3. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

ADMIN_USERNAME=admin
ADMIN_PASSWORD=123456

JWT_SECRET=gere-uma-string-aleatoria-longa-aqui-ex-abcde12345fghij

NEXT_PUBLIC_STORE_NAME=DROP STORE
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

### 4. Rode o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## Estrutura de pastas

```
tshirt-shop/
├── app/
│   ├── page.tsx                    # Home — grid de produtos
│   ├── products/[id]/              # Página de detalhes do produto
│   ├── order/[productId]/          # Formulário de encomenda
│   ├── success/                    # Tela de sucesso + QR Code PIX
│   ├── admin/
│   │   ├── login/                  # Login admin
│   │   ├── products/               # CRUD de produtos
│   │   ├── orders/                 # Lista de encomendas
│   │   ├── reports/                # Relatórios + exportação CSV
│   │   └── settings/               # Configurações (PIX, WhatsApp)
│   └── api/
│       ├── auth/login|logout/      # Autenticação
│       ├── products/               # API de produtos
│       ├── orders/                 # API de encomendas
│       ├── settings/               # API de configurações
│       └── reports/export/         # Exportação CSV
├── components/
│   ├── ui/                         # Componentes base (Button, Card, etc.)
│   ├── product-card.tsx
│   ├── navbar.tsx
│   ├── admin-sidebar.tsx
│   ├── pix-qr-code.tsx
│   └── status-badge.tsx
├── lib/
│   ├── supabase.ts                 # Cliente browser
│   ├── supabase-server.ts          # Cliente server (SSR)
│   ├── auth.ts                     # JWT helpers
│   ├── pix.ts                      # Gerador payload PIX (EMV)
│   ├── whatsapp.ts                 # Links WhatsApp
│   └── utils.ts
├── types/index.ts
├── middleware.ts                   # Proteção rotas /admin
└── supabase/
    ├── schema.sql
    └── seed.sql
```

---

## Acessos

| Rota | Descrição |
|------|-----------|
| `/` | Loja pública — grid de produtos |
| `/products/[id]` | Detalhes do produto |
| `/order/[productId]` | Formulário de encomenda |
| `/success` | Confirmação + QR Code PIX + WhatsApp |
| `/admin/login` | Login do painel admin |
| `/admin/products` | Gerenciar produtos |
| `/admin/orders` | Ver e gerenciar encomendas |
| `/admin/reports` | Relatórios e exportação CSV |
| `/admin/settings` | Chave PIX, WhatsApp, nome da loja |

**Credenciais padrão:** `admin` / `123456`
*(altere via variáveis de ambiente `ADMIN_USERNAME` e `ADMIN_PASSWORD`)*

---

## Funcionalidades

### Loja pública
- Grid responsivo de produtos com animações hover
- Página de detalhes com tamanhos, preço, informações
- Formulário de encomenda (nome, WhatsApp, tamanho, quantidade)
- Tela de sucesso com:
  - QR Code PIX real (padrão EMV brasileiro)
  - Chave PIX com botão de copiar
  - Valor calculado
  - Botão WhatsApp com mensagem pré-preenchida

### Painel Admin
- Login seguro com JWT em cookie httpOnly
- **Produtos:** criar, editar, deletar, ativar/desativar
- **Encomendas:** filtros por status/produto, marcar como pago, contato rápido
- **Relatórios:** cards de resumo, gráfico por tamanho, exportação CSV
- **Configurações:** chave PIX, número WhatsApp, preview do QR Code

---

## Geração do QR Code PIX

O app gera QR Codes PIX reais no padrão **EMV BR.GOV.BCB.PIX**, incluindo:
- CRC16 para validação
- Campo de valor (quando informado)
- Compatível com qualquer banco brasileiro

---

## Build para produção

```bash
npm run build
npm start
```

Para deploy, recomendamos **Vercel** — conecte o repositório e configure as variáveis de ambiente.
