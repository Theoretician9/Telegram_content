// server/db.ts
import { PrismaClient } from '@prisma/client';

// Один экземпляр PrismaClient на всё приложение
export const db = new PrismaClient();
