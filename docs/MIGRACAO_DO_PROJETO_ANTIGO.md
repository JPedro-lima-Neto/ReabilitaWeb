# Mapeamento da migração

O projeto original foi analisado como referência.

| Projeto antigo | Projeto novo |
|---|---|
| Flask `web/app.py` | Express `backend/src/server.js` + controllers/routes |
| PostgreSQL / SQLAlchemy | MongoDB / Mongoose |
| Google OAuth + sessão Flask | JWT + bcrypt |
| Templates Jinja | React |
| `Paciente` SQLAlchemy | `models/Paciente.js` |
| `Prescricao` SQLAlchemy | `models/Prescricao.js` |
| `Exercicio` SQLAlchemy | `models/Exercicio.js` |
| `LISTA_EXERCICIOS_CARGA` | `seeds/exercicios.json` (39 exercícios) |
| ReportLab `pdf_generator.py` | PDFKit `services/pdfService.js` |
| `/dashboard` | `GET /api/dashboard` + tela React |
| `/pacientes` | CRUD `/api/pacientes` + tela React |
| `/nova-prescricao` | `POST /api/prescricoes` + tela React |
| `/historico` | `GET /api/prescricoes` + tela React |
| `/reimprimir/:id` | `GET /api/prescricoes/:id/pdf` |

O PDFKit mantém a mesma identidade visual-base do PDF antigo: título azul, identificação do paciente, exercícios numerados, descrição de execução, faixa azul de dosagem, recomendações em amarelo e assinatura/carimbo no rodapé.
