import mongoose from 'mongoose';

const exercicioSchema = new mongoose.Schema(
    {
        categoria: {
            type: String,
            required: true,
            trim: true
        },

        nome: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        descricao: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    'Exercicio',
    exercicioSchema
);