import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(200),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createRideSchema = z.object({
  name: z.string().min(2).max(100),
  destination: z.string().max(200).optional().nullable(),
});

export const joinRideSchema = z.object({
  joinCode: z.string().min(4).max(12),
});

export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  heading: z.number().nullable().optional(),
  speed: z.number().min(0).nullable().optional(),
  accuracy: z.number().min(0).nullable().optional(),
  timestamp: z.number().positive(),
});
