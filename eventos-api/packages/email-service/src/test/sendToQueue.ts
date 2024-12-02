import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const QUEUE_NAME = process.env.QUEUE_NAME as string;
const RABBITMQ_URL = process.env.RABBITMQ_URL as string;

const sendToQueue = async () => {
  const message = {
    email: 'gustavo.steinhoefel@gmail.com',
    tipo: 'cancelamento_inscricao',
    conteudo: {
      nome: 'Gustavo Steinhoefel',
      evento: 'Workshop de Node.js',
    },
  };

  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Certifica-se de que a fila existe
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Envia a mensagem
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true, // Garante que a mensagem não será perdida em caso de falha do RabbitMQ
    });

    console.log(`Mensagem enviada para a fila "${QUEUE_NAME}":`, message);

    // Fecha conexão
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Erro ao enviar mensagem para a fila:', error);
  }
};

sendToQueue();
