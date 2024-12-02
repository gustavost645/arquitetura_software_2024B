import { Router } from 'express';
import authMiddleware from '../middlewares/evento.middleware';
import * as inscricaoController from '../controllers/inscricao.controller';

const router = Router();

router.post('/presenca', authMiddleware, inscricaoController.presenca);
router.post('/cancelar', authMiddleware, inscricaoController.cancelamento);
router.post('/certificado', authMiddleware, inscricaoController.certificado);

// crud
router.get('/', authMiddleware, inscricaoController.findAllByUser);
router.get('/list', authMiddleware, inscricaoController.findAll);
router.get('/:id', authMiddleware, inscricaoController.findById);
router.post('/', authMiddleware, inscricaoController.save);
router.put('/:id', authMiddleware, inscricaoController.update);
router.delete('/:id', authMiddleware, inscricaoController.remove);

export default router;
