# Hotel System - Plataforma de Gestão Hoteleira Multi-Tenant

Aplicação web full-stack desenvolvida em arquitetura **SaaS (Software as a Service) Multi-Tenant**. O sistema permite que múltiplos hotéis gerenciem suas operações de forma independente compartilhando a mesma infraestrutura. 

A plataforma abrange desde a captação de hóspedes e reservas online com pagamento de sinal (30%) e emissão automática de voucher em PDF, até o controle completo de recepção (check-in, check-out, walk-in), política de cancelamento (CDC) e auditoria financeira por estabelecimento.

Projetado com foco rigoroso em segurança (*Zero Trust*), isolamento lógico de dados, rastreabilidade e automação de testes.

## Índice

1. [Arquitetura e Padrões de Projeto](#-arquitetura-e-padrões-de-projeto)
2. [Perfis de Acesso e Regras de Negócio](#-perfis-de-acesso-e-regras-de-negócio)
3. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
4. [Status de Desenvolvimento](#-status-de-desenvolvimento)
5. [Pré-requisitos](#-pré-requisitos)
6. [Configuração do Ambiente (.env)](#-configuração-do-ambiente-env)
7. [Como Executar Localmente](#-como-executar-localmente)
8. [Como Executar com Docker](#-como-executar-com-docker)
9. [Testes Automatizados e CI/CD](#-testes-automatizados-e-cicd)
10. [Documentação da API (Endpoints)](#-documentação-da-api-endpoints)

---

## Arquitetura e Padrões de Projeto

O backend da aplicação segue rigorosamente a separação de responsabilidades e padrões de engenharia de software:

* **Isolamento Multi-Tenant Lógico:** Todos os hotéis compartilham o mesmo banco de dados, mas os registros são rigidamente isolados por uma chave estrangeira (`hotelId`).
* **Middleware de Roteamento (Edge):** Interceptação de requisições por sub-rotas dinâmicas (ex: `/h/hotel-slug`), injetando o contexto do tenant de forma segura nos cabeçalhos HTTP (`x-tenant-slug`) para uso nas APIs.
* **Unit of Work (Transações Atômicas):** O onboarding de novos hotéis ocorre de forma transacional (Prisma `$transaction`), garantindo que o Tenant e o Usuário Admin nasçam juntos ou sofram *rollback* automático.
* **Validation & Zero Trust (`schemas/`):** Validação estrita na fronteira utilizando **Zod** (`.strict()`), sanitização contra *XSS* e isolamento de informações sensíveis via DTOs (ex: cálculo de tarifas feito exclusivamente no servidor).

---

## Perfis de Acesso e Regras de Negócio

O sistema é dividido em três atuações (aplicáveis a cada Tenant isoladamente):

### 1. Cliente / Lead (Camada Pública — Landing Page)
Focado no funil de conversão autônomo (`Lead → OTP → Mercado Pago → Webhook → PDF`):
* **Simulação e Regras:** Cálculo automático do valor total e **30% de taxa de reserva**.
* **Captação e Validação de Identidade (OTP):** Cadastro validado via código numérico (6 dígitos) enviado por e-mail, exigido antes do checkout.
* **Pagamento Online e Comprovante:** Checkout via Mercado Pago para quitar a taxa. Confirmação via Webhook dispara o Voucher em PDF.
* **Direito de Arrependimento:** Regra sistêmica que permite o cancelamento seguro da reserva em até **7 dias corridos** após a compra.

### 2. Funcionário / Recepcionista (Camada Restrita — Operação Diária)
* **Auditoria Contínua:** Todas as movimentações (check-ins, check-outs e recebimentos) ficam vinculadas ao `id` do recepcionista logado.
* **Check-in de Reserva Online:** Transição de `TAXA_RESERVA` para `EM_ANDAMENTO`, cobrando os **70% restantes** da estadia.
* **Atendimento Walk-in (Balcão):** Criação de reserva com status `CONFIRMADA_BALCAO` para clientes sem reserva prévia, com bloqueio imediato do quarto contra *overbooking*.
* **Check-out e Consumos:** Lançamento de extras (frigobar, restaurante) e encerramento da estadia mediante quitação total do saldo.

### 3. Administrador / Gerente (Camada Restrita — Gestão e Financeiro)
* **Onboarding e Equipe:** Configuração inicial do hotel, gestão de quartos, tarifas e permissões de recepcionistas.
* **Auditoria de Funil:** Monitoramento da taxa de conversão (Leads criados vs. OTP validado vs. Carrinho Abandonado).
* **Controle Financeiro Consolidado:** Separação exata entre Receita Online (Sinal Webhook) e Receita Presencial (Saldos, Walk-in e Consumos de Balcão).

---

## Tecnologias Utilizadas

* **Ecosistema React:** Next.js (App Router), React, TypeScript, Tailwind CSS
* **Persistência:** PostgreSQL, Prisma ORM (v6)
* **Segurança:** Zod, Rate Limiting, Hash bcrypt (Senhas) e crypto (OTP)
* **Testes & Qualidade:** Jest (integrado ao next/jest), ESLint, GitHub Actions
* **Infraestrutura:** Docker, Docker Compose (Alpine base)
* **Integrações (Em Desenvolvimento):** Mercado Pago, Resend/SendGrid, PDF Generator.

---

## Pré-requisitos

* [Node.js](https://nodejs.org/) (v20 ou superior)
* [Docker](https://www.docker.com/) e Docker Compose
* [Git](https://git-scm.com/)

---

## Configuração do Ambiente (`.env`)

Crie um arquivo `.env` na raiz do projeto. **Nunca versione este arquivo.**

```env
# Banco de Dados (PostgreSQL)
DATABASE_URL="postgresql://postgres:senha_secreta@localhost:5432/hotel_system?schema=public"

# Segurança
JWT_SECRET="chave_secreta_super_segura"

# Integrações
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=""
MERCADOPAGO_ACCESS_TOKEN=""
MERCADOPAGO_WEBHOOK_SECRET=""
```

---

## Como Executar (Ambiente de Desenvolvimento)

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/larissamonsalve/hotel-system.git
   cd hotel-system
   ```

2. **Instale as dependências e inicie o banco de dados (Docker):**
   ```bash
   npm install
   docker-compose up -d
   ```

3. **Gere os clientes e migre o banco de dados:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Inicie o servidor local:**
   ```bash
   npm run dev
   ```

---

## Testes Automatizados e CI/CD

O projeto utiliza **Jest** com suporte a tipagem nativa do Next.js. Os testes validam o isolamento Multi-Tenant injetando *mocks* do banco.

* **Executar suíte de testes:** `npm run test`
* **Verificar linting:** `npm run lint`

O fluxo de **CI/CD** (GitHub Actions) bloqueia integrações na `main` caso as etapas de tipagem, testes unitários ou build falhem.

---

## Documentação da API (Principais Endpoints)

### `POST /api/leads`
Registra um lead na camada pública antes da validação OTP. Requer o Middleware de edge ativo para resolução do Tenant.
* **Headers:** 
  * `Content-Type: application/json`
  * `x-tenant-slug: hotel-system` (Injetado via Middleware Next.js)
* **Body:** `{"nome": "João", "email": "joao@email.com", "whatsapp": "92999999999"}`
* **Respostas:** `201 Created` | `400 Bad Request` | `429 Too Many Requests`