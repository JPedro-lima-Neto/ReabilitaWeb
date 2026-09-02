import Paciente from '../models/Paciente.js';
import Exercicio from '../models/Exercicio.js';
import Prescricao from '../models/Prescricao.js';

const populate = [
    {
        path: 'paciente'
    },
    {
        path: 'exercicios.exercicio'
    }
];

export const resolvers = {
    Query: {
        pacientes: (_, args, context) => {
            return Paciente.find({
                usuario: context.usuario.id
            }).sort({
                nome: 1
            });
        },

        paciente: (_, args, context) => {
            return Paciente.findOne({
                _id: args.id,
                usuario: context.usuario.id
            });
        },

        exercicios: (_, args) => {
            const filtro = args.categoria
                ? {
                      categoria: args.categoria
                  }
                : {};

            return Exercicio.find(filtro).sort({
                categoria: 1,
                nome: 1
            });
        },

        prescricoes: (_, args, context) => {
            return Prescricao.find({
                usuario: context.usuario.id
            })
                .populate(populate)
                .sort({
                    createdAt: -1
                });
        },

        prescricao: (_, args, context) => {
            return Prescricao.findOne({
                _id: args.id,
                usuario: context.usuario.id
            }).populate(populate);
        },

        dashboard: async (_, args, context) => {
            const [pacientes, prescricoes] = await Promise.all([
                Paciente.countDocuments({
                    usuario: context.usuario.id
                }),

                Prescricao.countDocuments({
                    usuario: context.usuario.id
                })
            ]);

            return {
                pacientes,
                prescricoes
            };
        }
    }
};