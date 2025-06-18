import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUser } from '../types/auth';

/**
 * Middleware de autenticação JWT.
 * Garante que apenas usuários autenticados possam acessar rotas protegidas.
 *
 * Uso:
 *   app.use('/rota-protegida', authenticate);
 *
 * O usuário autenticado ficará disponível em req.user.
 */
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não está definido nas variáveis de ambiente. Configure antes de iniciar o backend.');
}

export function authenticate(req: Request & { user?: AuthUser }, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as unknown as AuthUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
} 