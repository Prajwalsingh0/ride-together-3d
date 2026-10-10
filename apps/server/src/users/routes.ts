import { Router, Response } from 'express';
import { db } from '../database/memory';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.delete('/me', requireAuth, (req: AuthRequest, res: Response) => {
  db.deleteUser(req.userId!);
  res.json({ ok: true, message: 'Account deleted' });
});

export default router;
