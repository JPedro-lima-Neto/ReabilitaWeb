export const typeDefs = `
    type Usuario {
        id: ID!
        nome: String!
        email: String!
    }

    type Paciente {
        id: ID!
        cpf: String!
        nome: String!
        createdAt: String
    }

    type Exercicio {
        id: ID!
        categoria: String!
        nome: String!
        descricao: String!
    }

    type ItemPrescricao {
        exercicio: Exercicio!
        dosagem: String!
    }

    type Prescricao {
        id: ID!
        paciente: Paciente!
        exercicios: [ItemPrescricao!]!
        queixa: String
        orientacoes: String
        createdAt: String
    }

    type Dashboard {
        pacientes: Int!
        prescricoes: Int!
    }

    type Query {
        pacientes: [Paciente!]!
        paciente(id: ID!): Paciente

        exercicios(
            categoria: String
        ): [Exercicio!]!

        prescricoes: [Prescricao!]!

        prescricao(
            id: ID!
        ): Prescricao

        dashboard: Dashboard!
    }
`;