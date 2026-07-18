import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'warn' },
    ],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

(prisma as any).$on('error', (e: any) => {
  logger.error(`Prisma Error: ${e.message}`, { target: e.target });
});

(prisma as any).$on('warn', (e: any) => {
  logger.warn(`Prisma Warning: ${e.message}`);
});

// Uncomment to log all queries in development
// prisma.$on('query', (e) => {
//   logger.debug(`Query: ${e.query}`, { duration: e.duration });
// });
