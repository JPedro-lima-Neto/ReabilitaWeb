import Exercicio from '../models/Exercicio.js';

export async function listar(req, res) {
    const filtro = req.query.categoria
        ? {
              categoria: req.query.categoria
          }
        : {};

    const exercicios = await Exercicio.find(filtro).sort({
        categoria: 1,
        nome: 1
    });

    res.json(exercicios);
}

export async function obter(req, res) {
    const exercicio = await Exercicio.findById(req.params.id);

    if (!exercicio) {
        return res.status(404).json({
            erro: 'Exercício não encontrado.'
        });
    }

    res.json(exercicio);
}

export async function criar(req, res) {
    try {
        const exercicio = await Exercicio.create(req.body);

        res.status(201).json(exercicio);
    } catch (erro) {
        res.status(400).json({
            erro: erro.message
        });
    }
}

export async function atualizar(req, res) {
    try {
        const exercicio = await Exercicio.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!exercicio) {
            return res.status(404).json({
                erro: 'Exercício não encontrado.'
            });
        }

        res.json(exercicio);
    } catch (erro) {
        res.status(400).json({
            erro: erro.message
        });
    }
}

export async function remover(req, res) {
    const exercicio = await Exercicio.findByIdAndDelete(
        req.params.id
    );

    if (!exercicio) {
        return res.status(404).json({
            erro: 'Exercício não encontrado.'
        });
    }

    res.status(204).end();
}