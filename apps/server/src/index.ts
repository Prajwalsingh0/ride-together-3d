/**
 * Ride Together 3D — Backend entry (Milestone 0 skeleton)
 * Full auth, rides, locations come in later milestones.
 */
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }, // tighten in production
});

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ride-together-server',
    milestone: 0,
    timestamp: new Date().toISOString(),
  });
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Ride Together server listening on :${PORT}`);
});
