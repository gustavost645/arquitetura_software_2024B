"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
const response_utils_1 = require("../utils/response.utils");
async function login(req, res, next) {
    const { email, password } = req.body;
    try {
        const { token, username, userId } = await auth_service_1.default.authenticateUser(email, password);
        res.status(200).json({ token, username, email, userId });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        const errorDetails = error instanceof Error ? { stack: error.stack } : {};
        (0, response_utils_1.sendErrorResponse)(res, `Erro ao autenticar usuário: ${errorMessage}`, errorDetails, 500);
        //next(new Error('Erro ao autenticar usuário'));
    }
}
async function register(req, res, next) {
    const { id, username, email, password } = req.body;
    try {
        const user = await auth_service_1.default.registerUser(id, username, email, password);
        res.status(201).json({ userId: user.id, username: user.username });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        const errorDetails = error instanceof Error ? { stack: error.stack } : {};
        (0, response_utils_1.sendErrorResponse)(res, `Erro ao registrar usuário: ${errorMessage}`, errorDetails, 500);
        //next(new Error('Erro ao registrar usuário: ' + (error instanceof Error ? error.message : 'erro desconhecido')));
    }
}
// Função para excluir um usuário
async function deleteUser(req, res, next) {
    const userId = req.params.id; // ID do usuário a ser excluído
    try {
        // Encontra o usuário a ser excluído
        const user = await auth_service_1.default.findById(userId);
        // Exclui o usuário
        await auth_service_1.default.deleteUsuario(userId);
        res.status(200).json({ message: 'usuario deletado com sucesso.' });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        const errorDetails = error instanceof Error ? { stack: error.stack } : {};
        (0, response_utils_1.sendErrorResponse)(res, `Erro ao deletar usuário: ${errorMessage}`, errorDetails, 500);
        //next(new Error('Erro ao deletar usuário: ' + (error instanceof Error ? error.message : 'erro desconhecido')));
    }
}
async function updateUser(req, res, next) {
    const userId = req.params.id; // ID do usuário a ser atualizado
    const updatedData = req.body;
    try {
        // Encontra o usuário pelo ID
        const user = await auth_service_1.default.findById(userId);
        if (!user) {
            //res.status(404).json({ error: 'User not found' });
            (0, response_utils_1.sendErrorResponse)(res, `Usuario não encontrado`, {}, 404);
        }
        // Atualiza o usuário com os novos dados
        const updatedUser = await auth_service_1.default.updateUsuario(userId, updatedData);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        const errorDetails = error instanceof Error ? { stack: error.stack } : {};
        (0, response_utils_1.sendErrorResponse)(res, `Erro ao atualizar usuário: ${errorMessage}`, errorDetails, 500);
        //next(new Error('Erro ao atualizar usuário: ' + (error instanceof Error ? error.message : 'erro desconhecido')));
    }
}
async function findAllUsers(req, res, next) {
    try {
        const users = await auth_service_1.default.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        const errorDetails = error instanceof Error ? { stack: error.stack } : {};
        (0, response_utils_1.sendErrorResponse)(res, `Erro listar usuários: ${errorMessage}`, errorDetails, 500);
        //next(new Error('Erro listar usuários'));
    }
}
async function findUser(req, res, next) {
    try {
        const userId = req.params.id;
        const user = await auth_service_1.default.findById(userId);
        res.status(200).json(user);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        const errorDetails = error instanceof Error ? { stack: error.stack } : {};
        (0, response_utils_1.sendErrorResponse)(res, `Erro listar usuários: ${errorMessage}`, errorDetails, 500);
        //next(new Error('Erro listar usuários'));
    }
}
exports.default = { register, login, updateUser, deleteUser, findUser, findAllUsers };
