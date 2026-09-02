# ReabilitaWeb

Migração do Gerador de Reabilitação original, desenvolvido com Flask, PostgreSQL e ReportLab, para uma arquitetura web moderna utilizando React, Node.js, Express e MongoDB.

O projeto foi desenvolvido para a disciplina de **Integração de Interfaces e Serviços WEB**.

---

## Arquitetura

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **API REST:** Express
- **GraphQL:** Apollo Server
- **Banco de dados:** MongoDB Atlas + Mongoose
- **Autenticação:** JWT + bcrypt
- **Geração de PDF:** PDFKit

### Fluxo da aplicação

```text
React / Vite
     |
     v
Node.js / Express
     |
     +---- REST API
     |
     +---- GraphQL
     |
     v
MongoDB Atlas
```

---

## Estrutura do projeto

```text
ReabilitaWeb/
|
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── graphql/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seeds/
│   │   ├── services/
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── docs/
│   ├── ESCOPO_PROJETO.md
│   └── MIGRACAO_DO_PROJETO_ANTIGO.md
│
├── .gitignore
└── README.md
```

---

## Pré-requisitos

Antes de executar o projeto, tenha instalado:

- Node.js
- npm
- Git

Para verificar:

```bash
node -v
npm -v
git --version
```

Também é necessário possuir acesso ao **MongoDB Atlas compartilhado do projeto**.

---

## Configuração do MongoDB Atlas

O projeto utiliza um banco MongoDB hospedado no MongoDB Atlas.

O banco utilizado pela aplicação é:

```text
reabilitacao_db
```

Cada integrante deve possuir um arquivo:

```text
backend/.env
```

Esse arquivo deve ser criado a partir de:

```text
backend/.env.example
```

Exemplo:

```env
MONGODB_URI=mongodb+srv://USUARIO:SENHA@SEU_CLUSTER.mongodb.net/reabilitacao_db?appName=Cluster0
JWT_SECRET=troque_por_uma_chave_forte
PORT=3000
FRONTEND_URL=http://localhost:5173
```

As credenciais reais do MongoDB Atlas e o `JWT_SECRET` não devem ser enviados ao GitHub.

### Liberar o IP no Atlas

Antes de iniciar o backend, confirme que o seu IP está autorizado no MongoDB Atlas:

```text
Security
→ Network Access
→ Add IP Address
→ Add Current IP Address
```

Caso apareça o erro:

```text
Could not connect to any servers in your MongoDB Atlas cluster
```

verifique primeiro se o IP atual está autorizado.

---

## Executando o backend

Abra um terminal na raiz do projeto e entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo:

```text
backend/.env
```

a partir do `.env.example` e preencha com as credenciais fornecidas pelo grupo.

### Gerar uma chave JWT

Uma chave pode ser gerada com:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copie o valor gerado para:

```env
JWT_SECRET=SUA_CHAVE_GERADA
```

---

## Popular o banco com exercícios

Para inserir os exercícios iniciais:

```bash
npm run seed
```

O resultado esperado é semelhante a:

```text
MongoDB conectado.
39 exercícios carregados.
```

O seed pode ser executado novamente sem duplicar os exercícios.

---

## Iniciar o backend

Execute:

```bash
npm run dev
```

O resultado esperado é:

```text
MongoDB conectado.
API em http://localhost:3000 | GraphQL em /graphql
```

O backend ficará disponível em:

```text
http://localhost:3000
```

Também é possível testar:

```text
http://localhost:3000/api/health
```

A rota raiz deve retornar algo semelhante a:

```json
{
  "projeto": "ReabilitaWeb",
  "status": "online",
  "api": "/api",
  "graphql": "/graphql"
}
```

---

## Autenticação

A aplicação utiliza JWT para proteger as rotas privadas.

### Criar usuário

Endpoint:

```text
POST /api/auth/register
```

Exemplo:

```json
{
  "nome": "Profissional Teste",
  "email": "teste@teste.com",
  "senha": "123456"
}
```

URL completa para testes locais:

```text
http://localhost:3000/api/auth/register
```

### Login

Endpoint:

```text
POST /api/auth/login
```

Exemplo:

```json
{
  "email": "teste@teste.com",
  "senha": "123456"
}
```

Nas rotas protegidas, envie o token JWT no cabeçalho:

```text
Authorization: Bearer SEU_TOKEN
```

No Postman:

```text
Authorization
→ Type: Bearer Token
→ Token: SEU_TOKEN
```

---

## Principais endpoints REST

### Autenticação

```text
POST /api/auth/register
POST /api/auth/login
```

### Pacientes

```text
GET    /api/pacientes
POST   /api/pacientes
GET    /api/pacientes/:id
PUT    /api/pacientes/:id
DELETE /api/pacientes/:id
```

### Exercícios

```text
GET    /api/exercicios
POST   /api/exercicios
GET    /api/exercicios/:id
PUT    /api/exercicios/:id
DELETE /api/exercicios/:id
```

### Prescrições

```text
GET    /api/prescricoes
POST   /api/prescricoes
GET    /api/prescricoes/:id
PUT    /api/prescricoes/:id
DELETE /api/prescricoes/:id
```

### PDF

```text
GET /api/prescricoes/:id/pdf
```

### Dashboard

```text
GET /api/dashboard
```

---

## GraphQL

O endpoint GraphQL está disponível em:

```text
http://localhost:3000/graphql
```

O GraphQL também utiliza autenticação JWT.

Envie:

```text
Authorization: Bearer SEU_TOKEN
```

Os arquivos responsáveis pelo GraphQL estão em:

```text
backend/src/graphql/schema.js
backend/src/graphql/resolvers.js
```

---

## Executando o frontend

Abra outro terminal e entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie:

```text
frontend/.env
```

a partir de:

```text
frontend/.env.example
```

O conteúdo deve ser:

```env
VITE_API_URL=http://localhost:3000/api
```

Depois execute:

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:5173
```

---

## Ordem recomendada para execução

Sempre inicie primeiro o backend.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Depois acesse:

```text
http://localhost:5173
```

---

## Configuração para novos integrantes

Depois de clonar o projeto:

```bash
git clone URL_DO_REPOSITORIO
cd ReabilitaWeb
```

### Backend

```bash
cd backend
npm install
```

Crie o arquivo:

```text
backend/.env
```

utilizando o `.env.example` como modelo e preencha com as credenciais fornecidas pelo grupo.

Se o banco ainda não possuir os exercícios iniciais, execute:

```bash
npm run seed
```

Depois:

```bash
npm run dev
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
```

Crie o arquivo:

```text
frontend/.env
```

utilizando o `.env.example` como modelo.

Depois:

```bash
npm run dev
```

Acesse:

```text
http://localhost:5173
```

---

## Banco compartilhado

Todos os integrantes do grupo utilizam o mesmo MongoDB Atlas.

```text
Integrante 1 ──┐
Integrante 2 ──┼── MongoDB Atlas
Integrante 3 ──┘
```

Isso significa que os dados criados por um integrante podem ser visualizados pelos demais.

As credenciais devem ser compartilhadas apenas entre os integrantes autorizados.

---

## Segurança

Nunca envie ao GitHub:

- `.env`
- senha do MongoDB Atlas
- `MONGODB_URI` real
- `JWT_SECRET`
- tokens JWT

O arquivo `.env.example` pode ser versionado normalmente.

O `.gitignore` do projeto já está configurado para ignorar os arquivos `.env`.

---

## Geração de PDF

A geração de PDF está isolada em:

```text
backend/src/services/pdfService.js
```

Dessa forma, alterações no layout do PDF não afetam controllers, banco de dados ou frontend.

---

## Scripts do backend

### Desenvolvimento

```bash
npm run dev
```

Executa o servidor com Nodemon.

### Execução normal

```bash
npm start
```

Executa o servidor com Node.js.

### Seed

```bash
npm run seed
```

Carrega os exercícios iniciais no MongoDB.

---

## Scripts do frontend

### Desenvolvimento

```bash
npm run dev
```

Executa o frontend em modo de desenvolvimento.

### Build

```bash
npm run build
```

Gera a versão de produção.

### Preview

```bash
npm run preview
```

Executa localmente a versão gerada pelo build.