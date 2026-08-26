import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
    {
        exercicio: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercicio',
            required: true
        },

        dosagem: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        _id: false
    }
);

const configuracaoPdfSchema = new mongoose.Schema(
    {
        modelo: {
            type: String,
            enum: [
                'classico',
                'compacto',
                'detalhado'
            ],
            default: 'classico'
        },

        mostrarDescricao: {
            type: Boolean,
            default: true
        },

        mostrarQueixa: {
            type: Boolean,
            default: true
        },

        mostrarOrientacoes: {
            type: Boolean,
            default: true
        },

        mostrarAssinatura: {
            type: Boolean,
            default: true
        },

        mostrarCpf: {
            type: Boolean,
            default: true
        },

        mostrarDataNascimento: {
            type: Boolean,
            default: false
        },

        orientacao: {
            type: String,
            enum: [
                'portrait',
                'landscape'
            ],
            default: 'portrait'
        },

        tamanhoFonte: {
            type: String,
            enum: [
                'pequena',
                'normal',
                'grande'
            ],
            default: 'normal'
        },

        corPrincipal: {
            type: String,
            enum: [
                'azul',
                'verde',
                'roxo',
                'preto'
            ],
            default: 'azul'
        },

        mostrarCabecalhoClinica: {
            type: Boolean,
            default: true
        },

        mostrarNumeroPrescricao: {
            type: Boolean,
            default: false
        }
    },
    {
        _id: false
    }
);

const prescricaoSchema = new mongoose.Schema(
    {
        paciente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Paciente',
            required: true
        },

        exercicios: {
            type: [itemSchema],
            required: true,
            validate: {
                validator: (exercicios) => exercicios.length > 0,
                message: 'A prescrição deve possuir pelo menos um exercício.'
            }
        },

        queixa: {
            type: String,
            default: '',
            trim: true
        },

        orientacoes: {
            type: String,
            default: '',
            trim: true
        },

        configuracaoPdf: {
            type: configuracaoPdfSchema,
            default: () => ({})
        },

        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    'Prescricao',
    prescricaoSchema
);