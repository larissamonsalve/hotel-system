# Hotel System — Plataforma de Gestão Hoteleira Multi-Tenant

Aplicação web full-stack desenvolvida em arquitetura **SaaS (Software as a Service) Multi-Tenant** com suporte **White-Label**. O sistema permite que múltiplos hotéis gerenciem suas operações e identidades visuais de forma independente compartilhando a mesma infraestrutura, reduzindo custos operacionais e centralizando a manutenção.

A plataforma abrange desde a captação de hóspedes, atendimento contextualizado e reservas online com pagamento de sinal (30%) e emissão automática de voucher em PDF, até o controle completo de recepção (check-in, check-out, walk-in), política de cancelamento (CDC) e auditoria financeira por estabelecimento.

Projetado com foco rigoroso em segurança (*Zero Trust*), isolamento lógico de dados, rastreabilidade e automação de CI/CD.

---

## Índice

1. [Acesso ao Sistema em Produção (Live Demo)](#1-acesso-ao-sistema-em-produção-live-demo)
2. [Arquitetura e Padrões de Projeto](#2-arquitetura-e-padrões-de-projeto)
3. [Segurança e Proteção de Dados](#3-segurança-e-proteção-de-dados)
4. [Perfis de Acesso e Regras de Negócio](#4-perfis-de-acesso-e-regras-de-negócio)
5. [Tecnologias Utilizadas](#5-tecnologias-utilizadas)
6. [Status do Projeto e Deploy](#6-status-do-projeto-e-deploy)
7. [Pré-requisitos e Instalação](#7-pré-requisitos-e-instalação)
8. [Testes e Qualidade de Código](#8-testes-e-qualidade-de-código)
9. [Integração e Entrega Contínua (CI/CD)](#9-integração-e-entrega-contínua-cicd)
10. [Documentação da API](#10-documentação-da-api)

---

## 1. Acesso ao Sistema em Produção (Live Demo)

A aplicação está publicada na **Vercel** integrada ao **Supabase (PostgreSQL)**:

- **Tenant de Demonstração (Serpa Hotel):** [https://hotel-system-eosin-nine.vercel.app/h/hotel-serpa](https://hotel-system-eosin-nine.vercel.app/h/hotel-serpa)

---

## 2. Arquitetura e Padrões de Projeto

O ecossistema foi construído visando alta escalabilidade e manutenção facilitada, adotando padrões modernos de engenharia de software:

- **Isolamento Multi-Tenant Lógico (Shared Database):** Todos os hotéis compartilham o mesmo cluster PostgreSQL, porém os registros são rigidamente isolados em todas as consultas pela chave estrangeira `hotelId` e pelo identificador único `slug`.
- **Motor White-Label Dinâmico:** Cada estabelecimento possui identidade visual própria carregada sob demanda via Server Components (`corPrincipal`, `corSecundaria`, `logoUrl`, `politicaCancelamento` e canais de atendimento), sem valores fixos (*hardcoded*) na interface.
- **Stateless Funnel (Funil sem Estado):** O fluxo de reserva (`Escolha do Quarto → Captação do Lead → Validação OTP`) utiliza parâmetros de URL (`URLSearchParams`) para trafegar as escolhas do hóspede de forma transitória, impedindo a criação de "Reservas Fantasmas" no banco caso o carrinho seja abandonado. A reserva só é persistida após a validação de identidade.
- **Component Composition (SRP):** O frontend em React separa estritamente a orquestração de estado e regras de negócio (*Smart Components*) da camada de apresentação (*UI Components*), respeitando o *Single Responsibility Principle*.
- **Middleware de Roteamento (Edge):** Interceptação de requisições por sub-rotas dinâmicas (ex.: `/h/hotel-serpa`), validando o contexto do tenant e injetando cabeçalhos HTTP seguros (`x-tenant-slug`) para consumo interno pelas rotas de API.
- **Unit of Work & Singleton ORM:** Uso de instância compartilhada do Prisma Client (prevenindo exaustão de conexões em ambiente *serverless*) e transações atômicas (`$transaction`) para garantir integridade em operações críticas.

---

## 3. Segurança e Proteção de Dados

A plataforma adota a filosofia *Zero Trust*, protegendo tanto a aplicação quanto a infraestrutura:

- **Next.js Security Headers:** Injeção nativa de cabeçalhos restritivos (HSTS, `X-Content-Type-Options`, `X-Frame-Options` e `X-XSS-Protection`), mitigando ataques de *Clickjacking* e injeção de conteúdo.
- **Prevenção contra Mass Assignment:** Validação com **Zod** no modo `.strict()` na camada de DTOs, impedindo que payloads adulterados sobrescrevam colunas sensíveis ou restritas no banco de dados.
- **Prevenção contra SQLi e XSS:** O Prisma ORM realiza *parameterized queries* nativas contra SQL Injection, enquanto expressões regulares nos schemas do Zod sanitizam entradas no cliente e no servidor.
- **Rate Limiting (DoS Protection):** Controle de tráfego por IP nas rotas públicas (como captação de leads e disparo de códigos), mitigando força bruta e sobrecarga do banco.
- **Information Disclosure Prevention:** Tratamento centralizado de exceções (`try/catch`), garantindo que *stack traces* e metadados internos jamais vazem em respostas HTTP `500`.

---

## 4. Perfis de Acesso e Regras de Negócio

O sistema é dividido em três camadas de atuação encapsuladas por Tenant:

### 4.1. Hóspede / Lead (Camada Pública)
Focado em um funil de conversão autônomo e responsivo (`Landing Page → Checkout Lead → OTP → Pagamento → Voucher`):
- **Simulação Transparente:** Cálculo em tempo real das diárias, destacando o sinal obrigatório de **30% como taxa de reserva** e os 70% restantes para o check-in.
- **Atendimento Contextual (WhatsApp Multi-Tenant):** Canal direto com a recepção do hotel ativo tanto na vitrine quanto no checkout, com mensagens pré-preenchidas de acordo com a acomodação selecionada (ocultado automaticamente caso o tenant não utilize o canal).
- **Validação de Identidade (OTP):** Verificação via código numérico de 6 dígitos enviado por e-mail, com tempo de expiração curto, armazenamento em hash e limite de tentativas.
- **Pagamento e Voucher:** Consolidação exclusiva via Webhook autenticado, seguida da emissão automática do comprovante de reserva em PDF.

### 4.2. Recepcionista (Camada Restrita — Operacional)
- **Rastreabilidade Contínua:** Toda alteração de reserva ou lançamento financeiro vincula o `funcionarioId` responsável pela operação.
- **Check-in e Liquidação de Saldo:** Transição do status da reserva para `EM_ANDAMENTO` mediante conferência e quitação presencial do saldo de **70%**.
- **Walk-in (Balcão):** Criação imediata de hospedagem presencial com bloqueio instantâneo de disponibilidade (prevenção contra *overbooking*).
- **Consumos e Check-out:** Registro de itens extras na conta da acomodação e fechamento contábil da estadia.

### 4.3. Administrador / Gerente (Camada Restrita — Estratégica)
- **Gestão do Estabelecimento:** Administração de acomodações, tarifas, quadro de funcionários e parâmetros White-Label do hotel.
- **Auditoria de Funil:** Acompanhamento da taxa de conversão (Leads captados vs. Abandonos vs. Reservas confirmadas).
- **Conciliação Financeira:** Segregação clara entre Receita Digital (sinais online) e Receita Presencial (balcão e consumos).

---

## 5. Tecnologias Utilizadas

- **Core & Frontend:** React 19, Next.js 15 (App Router, Server Components), TypeScript, Tailwind CSS, Lucide React.
- **Backend & Persistência:** Node.js (Next.js Route Handlers), PostgreSQL (Supabase), Prisma ORM (v6).
- **Segurança & Validação:** Zod, Bcrypt (Hashes), Rate Limiting.
- **Testes & Qualidade:** Jest, ESLint, TypeScript (`strict: true`).
- **Infraestrutura & DevOps:** Docker & Docker Compose, Vercel, GitHub Actions.

---

## 6. Status do Projeto e Deploy

O projeto opera em fluxo de entrega contínua com banco em nuvem no **Supabase** e hospedagem na **Vercel**:

- ✅ **Fase 1 (Concluída):** Infraestrutura, Modelagem Multi-Tenant no Prisma, Landing Page e Checkout White-Label, Captação de Leads com validação Zod (Client/Server) e Integração Contextual com WhatsApp.
- ⏳ **Fase 2 (Em andamento):** Verificação de Identidade por E-mail (Geração, envio e validação de código OTP).
- 📅 **Fase 3 (Planejada):** Integração de Pagamentos (Pix/Cartão via Webhook) e Emissão de Voucher em PDF.
- 📅 **Fase 4 (Planejada):** Painel Operacional de Recepção e Dashboard Gerencial.

---

## 7. Pré-requisitos e Instalação

- [Node.js](https://nodejs.org/) (v20 ou superior)
- [Docker](https://www.docker.com/) com Docker Compose
- [Git](https://git-scm.com/)

### 7.1. Variáveis de Ambiente (`.env`)
Crie um arquivo `.env` na raiz do projeto (**nunca versione este arquivo no Git**):

```env
# Banco de Dados Local (Docker)
# Em produção (Supabase), use a porta 6543 (Pooler) na DATABASE_URL e a porta 5432 na DIRECT_URL
DATABASE_URL="postgresql://postgres:senha_secreta@localhost:5432/hotel_system?schema=public"
DIRECT_URL="postgresql://postgres:senha_secreta@localhost:5432/hotel_system?schema=public"

# Segurança
JWT_SECRET="chave_secreta_super_segura"

# Integrações de Pagamento e E-mail (Fases 2 e 3)
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=""
MERCADOPAGO_ACCESS_TOKEN=""
MERCADOPAGO_WEBHOOK_SECRET=""
```

### 7.2. Executando Localmente (Desenvolvimento)

1. Clone o repositório e instale as dependências:
   ```bash
   git clone [https://github.com/larissamonsalve/hotel-system.git](https://github.com/larissamonsalve/hotel-system.git)
   cd hotel-system
   npm install
   ```
2. Inicie o container do PostgreSQL:
   ```bash
   docker compose up -d
   ```
3. Gere o cliente do Prisma, aplique as migrações e popule os dados iniciais (Seed):
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse a vitrine do tenant inicial no navegador:
   ```text
   http://localhost:3000/h/hotel-serpa
   ```

*(Nota: Com `output: 'standalone'` configurado no `next.config.ts`, a aplicação também está pronta para empacotamento enxuto em imagem Docker para ambientes on-premise).*

---

## 8. Testes e Qualidade de Código

O projeto utiliza **Jest** com suporte nativo ao ecossistema Next.js/TypeScript. Os testes unitários validam regras de negócio, schemas Zod e o isolamento Multi-Tenant por meio de *mocks* da camada de persistência.

- **Executar suíte de testes:**
  ```bash
  npm run test
  ```
- **Executar análise estática (ESLint):**
  ```bash
  npm run lint
  ```

---

## 9. Integração e Entrega Contínua (CI/CD)

O repositório adota fluxo baseado em *Feature Branches* com validação automatizada antes de qualquer integração na branch `main`:

- **GitHub Actions (Quality Gate):** Cada *Pull Request* dispara a checagem de lint, tipagem estrita do TypeScript, suíte de testes Jest e validação de build do Next.js/Prisma. Falhas em qualquer etapa bloqueiam o merge.
- **Vercel Preview Deployments:** Todo PR recebe uma URL exclusiva de homologação conectada às variáveis seguras de Preview.
- **Deploy Automatizado e Migrações:** Ao aprovar o merge na `main`, o pipeline executa `prisma generate && prisma migrate deploy && next build`, aplicando migrações pendentes de forma não destrutiva no Supabase antes de publicar a nova versão.

---

## 10. Documentação da API

### `POST /api/leads`
Registra ou atualiza um lead na camada pública antes da etapa de validação OTP. Requer contexto de tenant válido.

- **Headers:**
  - `Content-Type: application/json`
  - `x-tenant-slug: hotel-serpa` *(Injetado e validado pelo Middleware/Rota)*
- **Body:**
  ```json
  {
    "nome": "Maria da Silva",
    "email": "maria@email.com",
    "whatsapp": "92999999999",
    "aceitaOfertas": true
  }
  ```
- **Pipeline de Segurança:** `Rate Limiting` ➔ `Verificação de Tenant Ativo` ➔ `Zod Parsing (.strict)` ➔ `SQL Parameterization` ➔ `Sanitized Response` (ocultação de metadados internos).
- **Respostas HTTP:**
  - `201 Created` — Lead registrado com sucesso.
  - `400 Bad Request` — Falha na validação dos campos enviados.
  - `404 Not Found` — Tenant inexistente ou inativo.
  - `429 Too Many Requests` — Limite de requisições por IP excedido.