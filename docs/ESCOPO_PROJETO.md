# Proposta Inicial — ReabilitaWeb

## Nome do projeto
ReabilitaWeb — Sistema de Prescrição e Acompanhamento de Exercícios Terapêuticos.

## Problema
Profissionais que atuam com reabilitação precisam organizar pacientes, selecionar exercícios terapêuticos, registrar orientações e produzir prescrições claras. Quando esse processo é realizado manualmente ou em ferramentas desconectadas, o histórico fica disperso, há retrabalho e torna-se mais difícil consultar prescrições anteriores.

## Público-alvo
Profissionais e estudantes supervisionados da área de fisioterapia/reabilitação que utilizam a clínica-escola ou ambientes semelhantes.

## Objetivo
Desenvolver uma aplicação WEB para centralizar o cadastro de pacientes, exercícios e prescrições terapêuticas, permitindo consultar históricos e gerar planos de exercícios em PDF.

## Funcionalidades previstas
Cadastro e login de usuários; autenticação e autorização com JWT; cadastro, consulta, edição e exclusão de pacientes; catálogo de exercícios por categoria; criação e consulta de prescrições; dosagem individualizada dos exercícios; registro de queixa e orientações; histórico de prescrições; dashboard; geração e reimpressão de PDF; API REST e consultas GraphQL.

## Fora do escopo
Diagnóstico automático; prescrição por inteligência artificial; prontuário eletrônico completo; teleconsulta; aplicativo mobile nativo; pagamentos; integração direta com SUS; envio automático por WhatsApp.

## Entidades
- Usuário: profissional autenticado no sistema.
- Paciente: pessoa acompanhada pelo profissional.
- Exercício: exercício terapêutico, categoria e descrição de execução.
- Prescrição: paciente, exercícios selecionados, dosagens, queixa, orientações e profissional responsável.

## Telas previstas
Login; Dashboard; Pacientes; Nova prescrição; Histórico de prescrições; visualização/reimpressão de PDF.

## Serviços WEB
REST: autenticação, CRUD de pacientes, CRUD de exercícios, CRUD de prescrições, dashboard e geração de PDF. GraphQL: consultas de pacientes, exercícios, prescrições e indicadores do dashboard.

## Integração

```text
┌──────────────────┐
│      REACT       │
│    FRONTEND      │
└────────┬─────────┘
         │ HTTP / JSON + JWT
┌────────▼─────────┐
│ NODE + EXPRESS   │
│     BACKEND      │
├────────┬─────────┤
│ REST   │ GraphQL │
│        │ Apollo  │
└────┬───┴────┬────┘
     │ Mongoose
┌────▼─────────────┐
│     MONGODB      │
└──────────────────┘

PDFKit no backend para geração das prescrições em PDF.
```

## Tecnologias
React, Vite, Node.js, Express, MongoDB, Mongoose, RESTful API, GraphQL, Apollo Server, JWT, bcrypt e PDFKit.
