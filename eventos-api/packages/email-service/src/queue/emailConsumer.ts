import amqp from 'amqplib';
import { enviarEmail } from "../services/emailService";
import dotenv from 'dotenv';

dotenv.config();

const QUEUE_NAME = process.env.QUEUE_NAME as string;
const RABBITMQ_URL = process.env.RABBITMQ_URL as string;

const consumeQueue = async () => {
  try {
    // Estabelece a conexão com RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log(`Consumidor conectado à fila "${QUEUE_NAME}"`);

    // Lógica para consumir mensagens da fila
    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (msg) {
          const emailData = JSON.parse(msg.content.toString());
          console.log('Mensagem recebida:', emailData);

          try {
            await enviarEmail(emailData);
            channel.ack(msg); 
          } catch (error) {
            console.error('Erro ao processar mensagem:', error);
            channel.nack(msg); 
          }
        }
      },
      { noAck: false }
    );

    // Escuta eventos de fechamento da conexão
    connection.on('close', () => {
      console.error('Conexão com RabbitMQ fechada. Tentando reconectar...');
      reconnect(); 
    });

    // Escuta eventos de erro
    connection.on('error', (err: any) => {
      console.error('Erro na conexão RabbitMQ:', err);
    });
  } catch (error) {
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

export default consumeQueue;
