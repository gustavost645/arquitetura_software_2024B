import { Router } from 'express';
import authMiddleware from '../middlewares/certificado.middleware';
import * as certificadoController from '../controllers/certificado.controller';

const router = Router();

router.post('/gerar', authMiddleware ,certificadoController.gerarCertificadoPdf);
router.get('/validar/:id', certificadoController.validarCertificado);

// crud
router.get('/', authMiddleware, certificadoController.findAll);
router.get('/:id', authMiddleware, certificadoController.findById);
router.post('/', authMiddleware, certificadoController.save);
router.put('/:id', authMiddleware, certificadoController.update);
router.delete('/:id', authMiddleware, certificadoController.deleteCertificado);

export default router;
