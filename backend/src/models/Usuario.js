import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        senhaHash: {
            type: String,
            required: true
        },

        tipo: {
            type: String,
            enum: [
                'profissional',
                'admin'
            ],
            default: 'profissional'
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    'Usuario',
    usuarioSchema
);