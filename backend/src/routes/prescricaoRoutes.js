import { Router } from 'express';
import {
    listar,
    obter,
    criar,
    atualizar,
    remover,
    pdf
} from '../controllers/prescricaoController.js';

const router = Router();

router.get(
    '/',
    listar
);

router.get(
    '/:id/pdf',
    pdf
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