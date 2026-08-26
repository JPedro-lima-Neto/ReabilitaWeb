import mongoose from 'mongoose';

const pacienteSchema = new mongoose.Schema(
    {
        cpf: {
            type: String,
            required: true,
            trim: true
        },

        nome: {
            type: String,
            required: true,
            trim: true
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

pacienteSchema.index(
    {
        cpf: 1,
        usuario: 1
    },
    {
        unique: true
    }
);

export default mongoose.model(
    'Paciente',
    pacienteSchema
);