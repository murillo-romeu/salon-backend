import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload{
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuhenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  const { secret } = authConfig.jwt;

  if (!authHeader) {
    throw new Error('JWT token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, secret);

    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new Error('Invalid JWT token');
  }
}
