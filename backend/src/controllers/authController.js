import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

function tokenPara(usuario) {
    return jwt.sign(
        {
            id: usuario._id.toString(),
            email: usuario.email,
            tipo: usuario.tipo
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '8h'
        }
    );
}

export async function registrar(req, res) {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: 'Nome, email e senha são obrigatórios.'
            });
        }

        const emailNormalizado = email.toLowerCase();

        const existente = await Usuario.findOne({
            email: emailNormalizado
        });

        if (existente) {
            return res.status(409).json({
                erro: 'Email já cadastrado.'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await Usuario.create({
            nome,
            email: emailNormalizado,
            senhaHash
        });

        res.status(201).json({
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            },
            token: tokenPara(usuario)
        });
    } catch (erro) {
        res.status(500).json({
            erro: erro.message
        });
    }
}

export async function login(req, res) {
    try {
        const { email, senha } = req.body;

        const emailNormalizado = String(
            email || ''
        ).toLowerCase();

        const usuario = await Usuario.findOne({
            email: emailNormalizado
        });

        if (!usuario) {
            return res.status(401).json({
                erro: 'Email ou senha inválidos.'
            });
        }

        const senhaValida = await bcrypt.compare(
            senha || '',
            usuario.senhaHash
        );

        if (!senhaValida) {
            return res.status(401).json({
                erro: 'Email ou senha inválidos.'
            });
        }

        res.json({
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            },
            token: tokenPara(usuario)
        });
    } catch (erro) {
        res.status(500).json({
            erro: erro.message
        });
    }
}