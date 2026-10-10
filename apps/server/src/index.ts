/**
 * Ride Together 3D — Backend
 * Auth, rides, membership, Socket.IO location sharing.
 * Uses in-memory store (no Docker required). Prisma schema provided for production.
 */
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './auth/routes';
import rideRoutes from './rides/routes';
import userRoutes from './users/routes';
import { setupSockets } from './sockets/handler';

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST'] },
});

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '64kb' }));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ride-together-server',
    milestone: '3-10',
    store: 'memory',
    timestamp: new Date().toISOString(),
  });
});

app.use('/auth', authRoutes);
app.use('/rides', rideRoutes);
app.use('/users', userRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

setupSockets(io);

httpServer.listen(PORT, () => {
  console.log(`Ride Together server listening on :${PORT}`);
  console.log(`  REST  http://localhost:${PORT}/health`);
  console.log(`  Socket.IO ready (auth required)`);
});
