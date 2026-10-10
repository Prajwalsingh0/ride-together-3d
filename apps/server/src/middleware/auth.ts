import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/crypto';
import { db } from '../database/memory';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization' });
    return;
  }
  try {
    const payload = verifyAccessToken(header.slice(7));
    const user = db.findUserById(payload.sub);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    req.userId = payload.sub;
    req.userEmail = payload.email;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
