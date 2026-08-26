import Paciente from '../models/Paciente.js';
import Prescricao from '../models/Prescricao.js';
import { gerarRelatorioPaciente } from '../services/relatorioService.js';

export async function listar(req, res) {
    const pacientes = await Paciente.find({
        usuario: req.usuario.id
    }).sort({
        nome: 1
    });

    res.json(pacientes);
}

export async function obter(req, res) {
    const paciente = await Paciente.findOne({
        _id: req.params.id,
        usuario: req.usuario.id
    });

    if (!paciente) {
        return res.status(404).json({
            erro: 'Paciente não encontrado.'
        });
    }

    res.json(paciente);
}

export async function criar(req, res) {
    try {
        const paciente = await Paciente.create({
            ...req.body,
            usuario: req.usuario.id
        });

        res.status(201).json(paciente);
    } catch (erro) {
        res.status(400).json({
            erro: erro.message
        });
    }
}

export async function atualizar(req, res) {
    try {
        const paciente = await Paciente.findOneAndUpdate(
            {
                _id: req.params.id,
                usuario: req.usuario.id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!paciente) {
            return res.status(404).json({
                erro: 'Paciente não encontrado.'
            });
        }

        res.json(paciente);
    } catch (erro) {
        res.status(400).json({
            erro: erro.message
        });
    }
}

export async function remover(req, res) {
    const paciente = await Paciente.findOneAndDelete({
        _id: req.params.id,
        usuario: req.usuario.id
    });

    if (!paciente) {
        return res.status(404).json({
            erro: 'Paciente não encontrado.'
        });
    }

    res.status(204).end();
}
export async function relatorio(req, res) {
    try {
        const paciente = await Paciente.findOne({
            _id: req.params.id,
            usuario: req.usuario.id
        });

        if (!paciente) {
            return res.status(404).json({
                erro: 'Paciente não encontrado.'
            });
        }

        const prescricoes =
            await Prescricao.find({
                paciente: paciente._id,
                usuario: req.usuario.id
            })
                .populate(
                    'exercicios.exercicio'
                )
                .sort({
                    createdAt: 1
                });

        const nomeArquivo =
            paciente.nome
                .trim()
                .replace(/\s+/g, '-')
                .toLowerCase();

        res.setHeader(
            'Content-Type',
            'application/pdf'
        );

        res.setHeader(
            'Content-Disposition',
            `inline; filename="relatorio-${nomeArquivo}.pdf"`
        );

        gerarRelatorioPaciente(
            paciente,
            prescricoes,
            res
        );
    } catch (erro) {
        res.status(500).json({
            erro: erro.message
        });
    }
}