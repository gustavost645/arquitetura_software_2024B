import { Router } from 'express';
import authMiddleware from '../middlewares/evento.middleware';
import * as eventoController from '../controllers/evento.controller';


const router = Router();

// crud
router.get('/', authMiddleware, eventoController.findAllByUser);
router.get('/list', authMiddleware, eventoController.findAll);
router.get('/template', authMiddleware, eventoController.findTempate);
router.get('/:id', authMiddleware, eventoController.findById);
router.post('/', authMiddleware, eventoController.save);
router.put('/:id', authMiddleware, eventoController.update);
router.delete('/:id', authMiddleware, eventoController.remove);

export default router;
