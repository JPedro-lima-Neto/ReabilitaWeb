import { Router } from 'express';
import {
    listar,
    obter,
    criar,
    atualizar,
    remover,
    relatorio
} from '../controllers/pacienteController.js';

const router = Router();

router.get(
    '/',
    listar
);

router.get(
    '/:id/relatorio',
    relatorio
);

router.get(
    '/:id',
    obter
);

router.post(
    '/',
    criar
);

router.put(
    '/:id',
    atualizar
);

router.delete(
    '/:id',
    remover
);

export default router;