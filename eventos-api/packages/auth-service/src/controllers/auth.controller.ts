import { NextFunction, Request, Response } from 'express';
import authService from '../services/auth.service';
import { User } from '@prisma/client';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.utils';

async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { email, password } = req.body;
  try {
    const { token, username, userId } = await authService.authenticateUser(email, password);
    res.status(200).json({ token, username, email, userId });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorDetails = error instanceof Error ? { stack: error.stack } : {};

    sendErrorResponse(res, `Erro ao autenticar usuário: ${errorMessage}`, errorDetails, 500);
    //next(new Error('Erro ao autenticar usuário'));
  }
}

async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id, username, email, password } = req.body;
  
  try {
    const user = await authService.registerUser(id, username, email, password);
    res.status(201).json({ userId: user.id, username: user.username });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorDetails = error instanceof Error ? { stack: error.stack } : {};

    sendErrorResponse(res, `Erro ao registrar usuário: ${errorMessage}`, errorDetails, 500);
    //next(new Error('Erro ao registrar usuário: ' + (error instanceof Error ? error.message : 'erro desconhecido')));
  }
}


// Função para excluir um usuário
async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.params.id;  // ID do usuário a ser excluído

  try {
    // Encontra o usuário a ser excluído
    const user = await authService.findById(userId);

    // Exclui o usuário
    await authService.deleteUsuario(userId);

    res.status(200).json({ message: 'usuario deletado com sucesso.' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorDetails = error instanceof Error ? { stack: error.stack } : {};

    sendErrorResponse(res, `Erro ao deletar usuário: ${errorMessage}`, errorDetails, 500);
    //next(new Error('Erro ao deletar usuário: ' + (error instanceof Error ? error.message : 'erro desconhecido')));
  }
}

async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.params.id as string;  // ID do usuário a ser atualizado
  const updatedData = req.body as Partial<User>;

  try {
    // Encontra o usuário pelo ID
    const user = await authService.findById(userId);

    if (!user) {
      //res.status(404).json({ error: 'User not found' });
      sendErrorResponse(res, `Usuario não encontrado`, {}, 404);
    }

    // Atualiza o usuário com os novos dados
    const updatedUser = await authService.updateUsuario(userId, updatedData);

    res.status(200).json(updatedUser);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorDetails = error instanceof Error ? { stack: error.stack } : {};

    sendErrorResponse(res, `Erro ao atualizar usuário: ${errorMessage}`, errorDetails, 500);
    //next(new Error('Erro ao atualizar usuário: ' + (error instanceof Error ? error.message : 'erro desconhecido')));
  }
}


async function findAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await authService.findAll();
    res.status(200).json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorDetails = error instanceof Error ? { stack: error.stack } : {};

    sendErrorResponse(res, `Erro listar usuários: ${errorMessage}`, errorDetails, 500);
    //next(new Error('Erro listar usuários'));
  }
}

async function findUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.params.id as string;
    const user = await authService.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorDetails = error instanceof Error ? { stack: error.stack } : {};

    sendErrorResponse(res, `Erro listar usuários: ${errorMessage}`, errorDetails, 500);
    //next(new Error('Erro listar usuários'));
  }
}

export default { register, login, updateUser, deleteUser, findUser, findAllUsers};
