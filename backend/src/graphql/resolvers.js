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
            })
                .sort({
                    nome: 1
                })
                .exec();
        },

        paciente: (_, args, context) => {
            return Paciente.findOne({
                _id: args.id,
                usuario: context.usuario.id
            }).exec();
        },

        exercicios: (_, args) => {
            const filtro = args.categoria
                ? {
                      categoria: args.categoria
                  }
                : {};

            return Exercicio.find(filtro)
                .sort({
                    categoria: 1,
                    nome: 1
                })
                .exec();
        },

        prescricoes: (_, args, context) => {
            return Prescricao.find({
                usuario: context.usuario.id
            })
                .populate(populate)
                .sort({
                    createdAt: -1
                })
                .exec();
        },

        prescricao: (_, args, context) => {
            return Prescricao.findOne({
                _id: args.id,
                usuario: context.usuario.id
            })
                .populate(populate)
                .exec();
        },

        dashboard: async (_, args, context) => {
            const [pacientes, prescricoes] = await Promise.all([
                Paciente.countDocuments({
                    usuario: context.usuario.id
                }).exec(),

                Prescricao.countDocuments({
                    usuario: context.usuario.id
                }).exec()
            ]);

            const recentes = await Prescricao.find({
                usuario: context.usuario.id
            })
                .populate(populate)
                .sort({
                    createdAt: -1
                })
                .limit(5)
                .exec();

            return {
                pacientes,
                prescricoes,
                recentes
            };
        }
    },

    Paciente: {
        createdAt: (paciente) => paciente.createdAt?.toISOString()
    },

    Prescricao: {
        createdAt: (prescricao) => prescricao.createdAt?.toISOString()
    }
};