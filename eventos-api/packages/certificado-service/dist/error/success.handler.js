"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const logSuccess = (req, res, next) => {
    // Interceptando a resposta antes de enviá-la
    const originalSend = res.send;
    // Sobrescreve o método send
    res.send = (body) => {
        // Captura o status code da resposta
        const statusCode = res.statusCode;
        const status = statusCode >= 400 ? 'error' : statusCode >= 200 ? 'success' : 'info';
        const message = body ? body : 'Request processed successfully';
        // Registra o log no banco de dados
        prisma.log.create({
            data: {
                level: status,
                message: message,
                timestamp: new Date().toISOString(),
                route: req.originalUrl,
                errorMessage: '',
            },
        }).catch((err) => {
            console.error('Erro ao registrar log no banco de dados:', err);
        });
        // Chama o método original send para retornar a resposta ao cliente
        return originalSend.call(res, body);
    };
    next();
};
exports.default = logSuccess;
