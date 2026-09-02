import Paciente from '../models/Paciente.js';
import Prescricao from '../models/Prescricao.js';

export async function dashboard(req, res) {
    const [pacientes, prescricoes] = await Promise.all([
        Paciente.countDocuments({
            usuario: req.usuario.id
        }),

        Prescricao.countDocuments({
            usuario: req.usuario.id
        })
    ]);

    const recentes = await Prescricao.find({
        usuario: req.usuario.id
    })
        .populate('paciente')
        .sort({
            createdAt: -1
        })
        .limit(5);

    res.json({
        pacientes,
        prescricoes,
        recentes
    });
}