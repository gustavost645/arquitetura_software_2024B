"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Carregar variáveis de ambiente
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const API_TOKEN = process.env.API_TOKEN;
// Middleware de autenticação
function authMiddleware(req, res, next) {
    const apiToken = req.headers['x-api-key'];
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (apiToken && apiToken === API_TOKEN) {
        next();
        return;
    }
    // Verificar autenticação com JWT
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            req.userId = decoded.userId; // Adiciona o userId no request
            next();
            return;
        }
        catch (error) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
    }
    res.status(401).json({ error: 'Invalid token' });
}
exports.default = authMiddleware;
