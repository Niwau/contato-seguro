# 🛡️ Contato Seguro API

<img src="https://i.imgur.com/bFLADId.png"/>

![](https://imgur.com/a/IX7ZU9S)
![](https://img.shields.io/badge/Node.js-22+-green?style=flat&logo=node.js)
![](https://img.shields.io/badge/TypeScript-5.2-blue?style=flat&logo=typescript)
![](https://img.shields.io/badge/Express-5.0.0-yellow?style=flat&logo=express)
![](https://img.shields.io/badge/MongoDB-6.0-green?style=flat&logo=mongodb)
![](https://img.shields.io/badge/Redis-7.0-red?style=flat&logo=redis)
![](https://img.shields.io/badge/Vitest-1.0-purple?style=flat&logo=vitest)
![](https://img.shields.io/badge/Docker-24.0-blue?style=flat&logo=docker)
![](https://img.shields.io/badge/OpenAPI-3.0-red?style=flat&logo=openapi)
![](https://img.shields.io/badge/Swagger-UI-brightgreen?style=flat&logo=swagger)

API RESTful para gerenciamento corporativo (Empresas e Funcionários).

## 🚀 Tecnologias & Stack

O projeto utiliza o ecossistema mais moderno do Node.js em 2025:

- **Core:** Node.js 22+, TypeScript, Express v5.
- **Database:** MongoDB (Mongoose v9) & Redis (IORedis).
- **Logs:** Winston (Logs estruturados e coloridos).
- **Segurança:** Rate Limiting, Bcrypt, validação estrita.
- **Validação:** Zod (Schema Validation na camada de serviço).
- **Testes:** Vitest + Supertest + MongoDB Memory Server.
- **Docs:** OpenAPI 3.0 + Scalar (Interface moderna).
- **DevOps:** Docker, Husky, ESLint & Prettier.

## 🛠️ Instalação e Execução

### Pré-requisitos

- **Docker & Docker Compose** (Recomendado)
- Ou **Node.js v22+** (Caso rode localmente)

### Opção 1: Via Docker (Plug & Play)

A maneira mais rápida de testar. Sobe a API, o MongoDB e o Redis automaticamente.

```bash
# 1. Clone o repositório
git clone https://github.com/Niwau/contato-seguro
cd contato-seguro

# 2. Suba o ambiente (Build + Run)
docker-compose up --build
```

A API estará disponível em: `http://localhost:3000`

### Opção 2: Desenvolvimento Local

```bash
# 1. Instale as dependências
npm install

# 2. Configure o ambiente
cp .env.example .env
# (Certifique-se de ter um MongoDB e Redis rodando localmente ou ajuste o .env)

# 3. Execute em modo watch
npm run dev
```

---

## 📖 Documentação da API

Acesse a documentação completa e interativa (Swagger/OpenAPI) através do navegador:

👉 **[http://localhost:3000/api/v1/docs](https://www.google.com/search?q=http://localhost:3000/api/v1/docs)**

---

## 🧪 Estratégia de Testes

O projeto utiliza **Vitest** para execução de alta performance.

### Por que Testes de Integração (E2E)?

Optou-se deliberadamente por focar em **Testes de Integração** em vez de Testes Unitários isolados com mocks.

**Justificativa Técnica:**

1. **Fidelidade:** Em aplicações CRUD, a maior complexidade reside na interação com o banco (Constraints, Indexes, Queries). Mocks de unitários tendem a esconder falhas reais do banco de dados.
2. **Cobertura Real:** Utilizamos `mongodb-memory-server` para subir um banco real em memória. Isso garante que o fluxo completo (Router → Controller → Service → Validação Zod → Mongoose) funcione harmoniosamente.
3. **Evitar "False Positives":** Testes unitários excessivamente mockados muitas vezes passam mesmo quando a query do banco está errada. O teste de integração elimina esse risco.

<!-- end list -->

```bash
# Rodar suite de testes
npm test

# Rodar com cobertura de código
npm run coverage

# Modo watch (desenvolvimento)
npm run test:watch
```

---

## 📂 Arquitetura do Projeto

Arquitetura modular baseada em Entidades (Feature-based) para facilitar a manutenção.

```text
src/
├── config/         # Configurações (DB, Redis, Envs)
├── docs/           # Definições da OpenAPI (Schemas e Paths)
├── entities/       # Módulos de Domínio
│   ├── company/    # (Model, Service, Controller, Schemas, Tests)
│   └── employee/   # (Model, Service, Controller, Schemas, Tests)
├── middlewares/    # (ErrorHandler, RateLimiter, Logger)
├── utils/          # (APIError, Validadores, Logger)
└── app.ts          # Setup do Express
```

---

<div align="center">
  <sub>Desenvolvido com ❤️ por Guilherme Ribeiro</sub>
</div>
