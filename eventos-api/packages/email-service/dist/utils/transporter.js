"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Verificação das variáveis de ambiente
const serviceMail = process.env.SERVICE_MAIL || 'gmail';
const email = process.env.EMAIL || 'teste@teste.com';
const passMail = process.env.PASS_MAIL || 'teste';
if (!email || !passMail) {
    throw new Error('Por favor, configure as variáveis de ambiente EMAIL e PASS_MAIL.');
}
const emailTransporter = nodemailer_1.default.createTransport({
    service: serviceMail,
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use true para SSL (porta 465), false para TLS (porta 587)
    auth: {
        user: email,
        pass: passMail,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
exports.default = emailTransporter;
