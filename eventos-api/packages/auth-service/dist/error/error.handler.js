"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
    logger_utils_1.default.error(`${err.message}`, {
        route: req.originalUrl,
        status: res.statusCode,
        errorMessage: err.message,
        stack: err.stack,
    });
    // Define o statusCode com base no tipo de erro
    const statusCode = err.statusCode || (err instanceof Error ? 500 : 400);
    // Retorna a resposta ao cliente
    res.status(statusCode).json({
        message: statusCode >= 500 ? 'Internal server error' : err.message,
        error: err.message,
    });
};
exports.default = errorHandler;
