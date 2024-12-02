import { Response } from 'express';

// Definir tipo para a resposta
interface SuccessResponse<T> {
  status: 'success';
  message: string;
  data: T;
}

interface ErrorResponse {
  status: 'error';
  message: string;
  details?: any;
}

// Função de sucesso genérica
export const sendSuccessResponse = <T>(res: Response, message: string, data: T) => {
  res.status(200).json({
    status: 'success',
    message,
    data,
  });
};

// Função de erro genérica
export const sendErrorResponse = (res: Response, message: string, details?: any, statusCode = 400) => {
  res.status(statusCode).json({
    status: 'error',
    message,
    details,
  });
};
