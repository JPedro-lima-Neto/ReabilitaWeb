import Prescricao from '../models/Prescricao.js';
import Paciente from '../models/Paciente.js';
import { gerarPdfPrescricao } from '../services/pdfService.js';

const populate = [
    {
        path: 'paciente'
    },
    {
        path: 'exercicios.exercicio'
    }
];

export async function listar(req, res) {
    const prescricoes = await Prescricao.find({
        usuario: req.usuario.id
    })
        .populate(populate)
        .sort({
            createdAt: -1
        });

    res.json(prescricoes);
}

export async function obter(req, res) {
    const prescricao = await Prescricao.findOne({
        _id: req.params.id,
        usuario: req.usuario.id
    }).populate(populate);

    if (!prescricao) {
        return res.status(404).json({
            erro: 'Prescrição não encontrada.'
        });
    }

    res.json(prescricao);
}

export async function criar(req, res) {
    try {
        const paciente = await Paciente.findOne({
            _id: req.body.paciente,
            usuario: req.usuario.id
        });

        if (!paciente) {
            return res.status(400).json({
                erro: 'Paciente inválido.'
            });
        }

        const prescricao = await Prescricao.create({
            ...req.body,
            usuario: req.usuario.id
        });

        await prescricao.populate(populate);

        res.status(201).json(prescricao);
    } catch (erro) {
        res.status(400).json({
            erro: erro.message
        });
    }
}

export async function atualizar(req, res) {
    try {
        if (req.body.paciente) {
            const paciente = await Paciente.findOne({
                _id: req.body.paciente,
                usuario: req.usuario.id
            });

            if (!paciente) {
                return res.status(400).json({
                    erro: 'Paciente inválido.'
                });
            }
        }

        const prescricao = await Prescricao.findOneAndUpdate(
            {
                _id: req.params.id,
                usuario: req.usuario.id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate(populate);

        if (!prescricao) {
            return res.status(404).json({
                erro: 'Prescrição não encontrada.'
            });
        }

        res.json(prescricao);
    } catch (erro) {
        res.status(400).json({
            erro: erro.message
        });
    }
}

export async function remover(req, res) {
    const prescricao = await Prescricao.findOneAndDelete({
        _id: req.params.id,
        usuario: req.usuario.id
    });

    if (!prescricao) {
        return res.status(404).json({
            erro: 'Prescrição não encontrada.'
        });
    }

    res.status(204).end();
}

export async function pdf(req, res) {
    const prescricao = await Prescricao.findOne({
        _id: req.params.id,
        usuario: req.usuario.id
    }).populate(populate);

    if (!prescricao) {
        return res.status(404).json({
            erro: 'Prescrição não encontrada.'
        });
    }

    const nomePaciente = prescricao.paciente.nome.replace(
        /\s+/g,
        '-'
    );

    res.setHeader(
        'Content-Type',
        'application/pdf'
    );

    res.setHeader(
        'Content-Disposition',
        `inline; filename="prescricao-${nomePaciente}.pdf"`
    );

    gerarPdfPrescricao(prescricao, res);
}