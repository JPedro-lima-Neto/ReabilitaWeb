# ReabilitaWeb

Migração do Gerador de Reabilitação original (Flask/PostgreSQL/ReportLab) para a arquitetura exigida na disciplina de Integração de Interfaces e Serviços WEB.

## Arquitetura

- Frontend: React + Vite
- Backend: Node.js + Express
- REST: Express
- GraphQL: Apollo Server
- Banco: MongoDB + Mongoose
- Autenticação: JWT + bcrypt
- PDF: PDFKit, reproduzindo o modelo do PDF antigo

## Pastas

- `backend/`: Fase 1 — API REST, GraphQL, JWT, MongoDB e PDF.
- `frontend/`: Fase 2 — React consumindo a API.
- `docs/`: escopo e arquitetura para a atividade.

## Como executar a Fase 1

1. Instale MongoDB localmente ou use MongoDB Atlas.
2. Entre em `backend`.
3. Copie `.env.example` para `.env` e ajuste `MONGODB_URI` e `JWT_SECRET`.
4. Execute `npm install`.
5. Execute `npm run seed` para inserir os 39 exercícios do sistema original.
6. Execute `npm run dev`.
7. API REST: `http://localhost:3000/api`.
8. GraphQL: `http://localhost:3000/graphql`.

### Primeiro usuário

Crie por REST:

`POST /api/auth/register`

```json
{ "nome": "Profissional Teste", "email": "teste@teste.com", "senha": "123456" }
```

Depois use o token retornado no cabeçalho:

`Authorization: Bearer SEU_TOKEN`

## Como executar a Fase 2

1. Entre em `frontend`.
2. Copie `.env.example` para `.env`.
3. Execute `npm install`.
4. Execute `npm run dev`.
5. Abra `http://localhost:5173`.

## Endpoints REST principais

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET/POST `/api/pacientes`
- GET/PUT/DELETE `/api/pacientes/:id`
- GET/POST `/api/exercicios`
- GET/PUT/DELETE `/api/exercicios/:id`
- GET/POST `/api/prescricoes`
- GET/PUT/DELETE `/api/prescricoes/:id`
- GET `/api/prescricoes/:id/pdf`
- GET `/api/dashboard`

## Observação

O PDFKit foi isolado em `backend/src/services/pdfService.js`. Assim, alterações no layout do PDF não afetam controllers, banco ou frontend.
