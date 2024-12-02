import { Router } from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Rotas de autenticação
router.post('/login', authController.login);

// rotas referente ao usuario
router.post('/register', authController.register);

router.get('/users', authMiddleware, authController.findAllUsers);
router.get('/users/:id', authMiddleware, authController.findUser);
router.put('/users/:id', authMiddleware, authController.updateUser);
router.delete('/users/:id', authMiddleware, authController.deleteUser);


// Rota protegida
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Access granted' });
});

export default router;
