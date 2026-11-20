# Hotel System - Plataforma de Gestão Hoteleira Multi-Tenant

Aplicação web full-stack desenvolvida em arquitetura **SaaS (Software as a Service) Multi-Tenant**. O sistema permite que múltiplos hotéis gerenciem suas operações de forma independente compartilhando a mesma infraestrutura, reduzindo custos e centralizando a manutenção.

A plataforma abrange desde a captação de hóspedes e reservas online com pagamento de taxa de reserva (30%) e emissão automática de voucher em PDF, até o controle completo de recepção (check-in, check-out, walk-in), política de cancelamento (CDC) e auditoria financeira por estabelecimento.

Projetado com foco rigoroso em segurança (*Zero Trust*), isolamento lógico de dados, rastreabilidade e automação de CI/CD.

---

## Índice

1. [Acesso ao Sistema em Produção (Live Demo)](#-acesso-ao-sistema-em-produção-live-demo)
2. [Arquitetura e Padrões de Projeto](#1-arquitetura-e-padrões-de-projeto)
3. [Segurança e Proteção de Dados](#2-segurança-e-proteção-de-dados)
4. [Perfis de Acesso e Regras de Negócio](#3-perfis-de-acesso-e-regras-de-negócio)
5. [Tecnologias Utilizadas](#4-tecnologias-utilizadas)
6. [Status do Projeto e Deploy](#5-status-do-projeto-e-deploy)
7. [Pré-requisitos e Instalação](#6-pré-requisitos-e-instalação)
8. [Integração Contínua (CI/CD)](#7-integração-contínua-cicd)
9. [Documentação da API](#8-documentação-da-api)

---

## 1. Arquitetura e Padrões de Projeto

O ecossistema foi construído visando alta escalabilidade e manutenção facilitada, adotando padrões da engenharia de software moderna:

- **Isolamento Multi-Tenant Lógico (Shared Database):** Todos os hotéis compartilham o mesmo banco PostgreSQL, porém os registros são rigidamente isolados em todas as queries pela chave estrangeira `hotelId`.
- **Stateless Funnel (Funil sem Estado):** O fluxo de reserva (Escolha do Quarto → Captação do Lead → OTP) utiliza parâmetros de URL (`URLSearchParams`) para trafegar as escolhas do usuário de forma transitória e rápida, impedindo a criação de "Reservas Fantasmas" (Lixo de Banco) caso o usuário abandone o carrinho. A reserva só é persistida no banco após a validação de identidade.
- **Component Composition (FSD / Atomic Design):** O frontend (React) separa estritamente a Regra de Negócio (Smart Components) da Interface Visual (Dumb Components), garantindo o *Single Responsibility Principle (SRP)*.
- **Middleware de Roteamento (Edge):** Interceptação de requisições por sub-rotas dinâmicas (ex: `/h/serpa-hotel`), validando a existência do tenant e injetando o contexto de forma segura nos cabeçalhos HTTP (`x-tenant-slug`) para uso interno pelas APIs.
- **Unit of Work:** Transações atômicas no Prisma (`$transaction`) garantem que operações complexas, como o Onboarding de novos hotéis, ocorram de forma íntegra (Tudo ou Nada).

---

## 2. Segurança e Proteção de Dados

A plataforma adota a filosofia *Zero Trust*, protegendo tanto a aplicação quanto a infraestrutura:

- **Next.js Security Headers:** Injeção nativa de headers restritos (HSTS, `X-Content-Type-Options`, `X-Frame-Options` e `X-XSS-Protection`) impedindo Clickjacking e mitigando injeções maliciosas.
- **Prevenção contra Mass Assignment:** Uso da biblioteca **Zod** no modo `.strict()` na camada de DTOs, garantindo que nenhum payload modificado por invasores consiga sobrescrever campos restritos no banco de dados.
- **Prevenção contra SQLi e XSS:** O ORM (Prisma) realiza o *statement binding* nativo contra SQL Injection, enquanto regex no schema Zod filtra caracteres nocivos, sanitizando dados de entrada no lado do cliente e do servidor.
- **Rate Limiting (DoS Protection):** Middleware de controle de tráfego limita as requisições por IP nas rotas públicas (ex: Captação de Leads), mitigando ataques de força bruta e sobrecarga do banco.
- **Information Disclosure Prevention:** Tratamento seguro de exceções (`try/catch`), garantindo que *stack traces* e metadados de infraestrutura jamais sejam devolvidos em erros HTTP (500) para os clientes.

---

## 3. Perfis de Acesso e Regras de Negócio

O sistema é dividido em três atuações principais, encapsuladas por Tenant:

### 3.1. Cliente / Lead (Camada Pública)
Focado no funil de conversão autônomo e de alta performance (`Landing Page → Lead → OTP → Pagamento → Voucher`):
- **Simulação:** Cálculo em tempo real das diárias, indicando claramente a retenção de **30% como taxa de reserva** obrigatória.
- **Validação de Identidade (OTP):** Cadastro validado via código numérico de 6 dígitos enviado por e-mail, gerido com prazo de expiração e limite de tentativas.
- **Pagamento e Comprovante:** Transação digital segura. Apenas o Webhook autenticado pode consolidar a reserva e disparar o Voucher em PDF.

### 3.2. Recepcionista (Camada Restrita — Operacional)
- **Rastreabilidade Contínua:** Toda manipulação de reserva e transação financeira registra o `id` do funcionário logado no momento da ação.
- **Check-in e Saldos:** Transição do status de reserva para `EM_ANDAMENTO`, mediante pagamento presencial do saldo de **70%**.
- **Walk-in (Balcão):** Cadastro imediato e bloqueio de disponibilidade do quarto (anti-overbooking).
- **Consumos e Check-out:** Lançamento de extras à conta do quarto e liquidação financeira final.

### 3.3. Administrador / Gerente (Camada Restrita — Estratégica)
- **Gestão Organizacional:** Controle de quartos, status, funcionários e configuração base do hotel.
- **Auditoria de Funil:** Monitoramento analítico da conversão (Leads criados vs. Carrinhos Abandonados vs. Conversões Confirmadas).
- **Conciliação Financeira:** Separação contábil exata entre Receita Online (Digital) e Receita Balcão.

---

## 4. Tecnologias Utilizadas

- **Core & Frontend:** React 19, Next.js 15 (App Router, Server Components), TypeScript, Tailwind CSS, Lucide React.
- **Backend & Persistência:** Node.js (API Routes), PostgreSQL (Supabase), Prisma ORM (v6).
- **Segurança & Validação:** Zod, Bcrypt (Hashes), Rate-Limit (Memória/Edge).
- **Testes & Qualidade:** Jest, ESLint, TypeScript Strict Mode.
- **Infraestrutura & Deploy:** Docker (Local), Vercel (Produção e Previews), GitHub Actions (CI/CD).

---

## 5. Status do Projeto e Deploy

O sistema encontra-se com deploy contínuo integrado.

*   **Ambiente de Produção:** Hospedado na **Vercel** (Frontend e Middlewares) conectado ao banco **Supabase**.
*   ✅ **Fase 1 (Concluída):** Infraestrutura, Schema do Banco de Dados (Multi-Tenant), Landing Page Responsiva e Captação de Lead com validação Zod (Client/Server).
*   ⏳ **Fase 2 (Em andamento):** Rota de Verificação de Identidade (Sistema de OTP).

---

## 6. Pré-requisitos e Instalação

*   [Node.js](https://nodejs.org/) (v20 ou superior)
*   [Docker](https://www.docker.com/) e Docker Compose
*   [Git](https://git-scm.com/)

### 6.1. Configuração do Ambiente (`.env`)
Crie um arquivo `.env` na raiz do projeto (nunca versão este arquivo no Git):

```env
# Banco de Dados (PostgreSQL - Supabase ou Local)
DATABASE_URL="postgresql://postgres:senha_secreta@localhost:5432/hotel_system?schema=public"
DIRECT_URL="postgresql://postgres:senha_secreta@localhost:5432/hotel_system?schema=public"

# Segurança
JWT_SECRET="chave_secreta_super_segura"

# Integrações Futuras
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=""
MERCADOPAGO_ACCESS_TOKEN=""
MERCADOPAGO_WEBHOOK_SECRET=""
```

### 6.2. Rodando o Projeto (Modo Desenvolvimento)

1. Clone o repositório e instale as dependências:
   ```bash
   git clone https://github.com/larissamonsalve/hotel-system.git
   cd hotel-system
   npm install
   ```
2. Suba o Banco de Dados com Docker:
   ```bash
   docker-compose up -d
   ```
3. Gere o cliente Prisma e rode as migrações:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

*(Nota: Graças ao `output: 'standalone'` no `next.config.ts`, a aplicação também pode ser construída diretamente via Dockerfile para implantação on-premise).*

---

## 7. Testes Automatizados e CI/CD

O projeto utiliza **Jest** com suporte a tipagem nativa do Next.js. Os testes validam o isolamento Multi-Tenant injetando *mocks* do banco.

* **Executar suíte de testes:** `npm run test`
* **Verificar linting:** `npm run lint`

O fluxo de **CI/CD** (GitHub Actions) bloqueia integrações na `main` caso as etapas de tipagem, testes unitários ou build falhem.

---

## 8. Integração Contínua (CI/CD)

O repositório adota um fluxo de trabalho profissional (Trunk-based/Feature Branches):
- **GitHub Actions (Linter & Tests):** Todo `Pull Request` passa por uma varredura rigorosa. O merge é **bloqueado** caso haja erros de tipagem (`any` implícitos, variáveis não utilizadas) ou quebra em testes automatizados.
- **Vercel Preview Deploy:** A cada PR, a Vercel gera um ambiente de *Preview* descartável para homologação da Feature.
- **Deploy Automático:** Ao confirmar o *Merge* para a branch `main`, a Vercel realiza o *build standalone* e envia a aplicação otimizada para produção.

---

## 9. Documentação da API

### `POST /api/leads`
Registra um lead na camada pública antes da validação OTP. Requer o Middleware Multi-Tenant ativo.

- **Headers:** 
  - `Content-Type: application/json`
  - `x-tenant-slug: hotel-serpa` *(Injetado e validado no Edge/Route)*
- **Body:** 
  ```json
  {
    "nome": "Maria da Silva", 
    "email": "maria@email.com", 
    "whatsapp": "92999999999",
    "aceitaOfertas": true
  }
  ```
- **Fluxo de Segurança Executado:** Rate Limiting ➔ Verificação de Tenant Ativo ➔ Zod Parsing (.strict) ➔ SQL Parameterization ➔ Omit Response (Information Disclosure Protection).
- **Respostas:** 
  - `201 Created`
  - `400 Bad Request` (Zod Errors)
  - `429 Too Many Requests`