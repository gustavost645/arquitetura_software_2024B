import { PrismaClient } from '@prisma/client';
import { TransportStreamOptions } from 'winston-transport';
import { createLogger, transports, format } from 'winston';
import Transport from 'winston-transport';
import moment from 'moment-timezone';

const prisma = new PrismaClient();

class DatabaseTransport extends Transport {
  constructor(opts: TransportStreamOptions) {
    super(opts);
  }

  log(info: any, callback: () => void): void {
    callback();

    const timestamp = moment().tz('America/Sao_Paulo').toISOString();

    // Criando um novo log no banco de dados usando Prisma
    prisma.log.create({
      data: {
        level: info.level,
        message: info.message,
        timestamp: timestamp,  // A data do log
        route: info.route || '',              // Rota, se disponível
        errorMessage: info.errorMessage || '',// Mensagem de erro, se disponível
      },
    }).catch((error) => {
      console.error('Erro ao registrar log no banco de dados:', error);
    });
  }
}

// Criando o logger com winston
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ 
      format: () => moment().tz('America/Sao_Paulo').toISOString(),
    }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),   // Exibe logs no console
    new DatabaseTransport({ level: 'info' })   // Adiciona o transporte para banco de dados
  ]
});

export default logger;

