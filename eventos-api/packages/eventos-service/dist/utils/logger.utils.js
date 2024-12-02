"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const winston_1 = require("winston");
const winston_transport_1 = __importDefault(require("winston-transport"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const prisma = new client_1.PrismaClient();
class DatabaseTransport extends winston_transport_1.default {
    constructor(opts) {
        super(opts);
    }
    log(info, callback) {
        callback();
        const timestamp = (0, moment_timezone_1.default)().tz('America/Sao_Paulo').toISOString();
        // Criando um novo log no banco de dados usando Prisma
        prisma.log.create({
            data: {
                level: info.level,
                message: info.message,
                timestamp: timestamp, // A data do log
                route: info.route || '', // Rota, se disponível
                errorMessage: info.errorMessage || '', // Mensagem de erro, se disponível
            },
        }).catch((error) => {
            console.error('Erro ao registrar log no banco de dados:', error);
        });
    }
}
// Criando o logger com winston
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: () => (0, moment_timezone_1.default)().tz('America/Sao_Paulo').toISOString(),
    }), winston_1.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })),
    transports: [
        new winston_1.transports.Console(), // Exibe logs no console
        new DatabaseTransport({ level: 'info' }) // Adiciona o transporte para banco de dados
    ]
});
exports.default = logger;
