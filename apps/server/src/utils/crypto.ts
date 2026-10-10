import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me-32chars!!';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me-32chars!';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface TokenPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
}

export function signAccessToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email, type: 'access' } satisfies TokenPayload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  } as jwt.SignOptions);
}

export function signRefreshToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email, type: 'refresh' } satisfies TokenPayload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): TokenPayload {
  const payload = jwt.verify(token, ACCESS_SECRET) as TokenPayload;
  if (payload.type !== 'access') throw new Error('Invalid token type');
  return payload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  const payload = jwt.verify(token, REFRESH_SECRET) as TokenPayload;
  if (payload.type !== 'refresh') throw new Error('Invalid token type');
  return payload;
}
