import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const API_TOKEN = process.env.API_TOKEN as string;

// Interface para adicionar o userId ao Request
interface AuthRequest extends Request {
  userId?: string;
}

// Middleware de autenticação
function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const apiToken = req.headers['x-api-key'];
  const authHeader = req.headers.authorization; 
  const token = authHeader?.split(' ')[1]; 

  if (apiToken && apiToken === API_TOKEN) {
    next();
    return;
  }

  // Verificar autenticação com JWT
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      req.userId = decoded.userId; // Adiciona o userId no request
      next();
      return;
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
  }

  res.status(401).json({ error: 'Invalid token' });
}

export default authMiddleware;