"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
// Função de sucesso genérica
const sendSuccessResponse = (res, message, data) => {
    res.status(200).json({
        status: 'success',
        message,
        data,
    });
};
exports.sendSuccessResponse = sendSuccessResponse;
// Função de erro genérica
const sendErrorResponse = (res, message, details, statusCode = 400) => {
    res.status(statusCode).json({
        status: 'error',
        message,
        details,
    });
};
exports.sendErrorResponse = sendErrorResponse;
