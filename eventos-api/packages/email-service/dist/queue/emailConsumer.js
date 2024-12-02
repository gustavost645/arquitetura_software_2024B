"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const emailService_1 = require("../services/emailService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const QUEUE_NAME = process.env.QUEUE_NAME;
const RABBITMQ_URL = process.env.RABBITMQ_URL;
const consumeQueue = async () => {
    try {
        // Estabelece a conexão com RabbitMQ
        const connection = await amqplib_1.default.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log(`Consumidor conectado à fila "${QUEUE_NAME}"`);
        // Lógica para consumir mensagens da fila
        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg) {
                const emailData = JSON.parse(msg.content.toString());
                console.log('Mensagem recebida:', emailData);
                try {
                    await (0, emailService_1.enviarEmail)(emailData);
                    channel.ack(msg);
                }
                catch (error) {
                    console.error('Erro ao processar mensagem:', error);
                    channel.nack(msg);
                }
            }
        }, { noAck: false });
        // Escuta eventos de fechamento da conexão
        connection.on('close', () => {
            console.error('Conexão com RabbitMQ fechada. Tentando reconectar...');
            reconnect();
        });
        // Escuta eventos de erro
        connection.on('error', (err) => {
            console.error('Erro na conexão RabbitMQ:', err);
        });
    }
    catch (error) {
        console.error('Erro ao conectar ao RabbitMQ:', error);
        setTimeout(reconnect, 5000);
    }
};
// Função de reconexão
const reconnect = () => {
    console.log('Tentando reconectar ao RabbitMQ...');
    consumeQueue().catch((err) => {
        console.error('Erro ao tentar reconectar ao RabbitMQ:', err);
    });
};
exports.default = consumeQueue;
