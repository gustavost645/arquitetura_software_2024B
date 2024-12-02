"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_utils_1 = require("../utils/response.utils");
const emailService_1 = require("../services/emailService");
async function sendMail(req, res, next) {
    const { email, tipo, conteudo } = req.body;
    try {
        // Validação dos campos obrigatórios
        if (!email || !tipo || !conteudo) {
            (0, response_utils_1.sendErrorResponse)(res, "Campos obrigatórios ausentes.", { missingFields: ["email", "tipo", "conteudo"], }, 400);
            return;
        }
        // Validação do formato do e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            (0, response_utils_1.sendErrorResponse)(res, "E-mail inválido.", { missingFields: ["email"], }, 400);
            return;
        }
        await (0, emailService_1.enviarEmail)({ email, tipo, conteudo });
        (0, response_utils_1.sendSuccessResponse)(res, 'E-mail enviado com sucesso!', {});
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        const errorDetails = error instanceof Error ? { stack: error.stack } : {};
        (0, response_utils_1.sendErrorResponse)(res, `Erro ao enviar e-mail: ${errorMessage}`, errorDetails, 500);
    }
}
exports.default = { sendMail };
