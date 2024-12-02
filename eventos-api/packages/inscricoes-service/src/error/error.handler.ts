import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';

// Middleware para tratamento de erros
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  
  logger.error(`${err.message}`, {
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

export default errorHandler;
