import app from './app';
import { config } from './config/env';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    // ── Infrastructure Initialization ──
    // await prisma.$connect();
    // await redis.connect();
    // await kafka.connect();
    
    const server = app.listen(config.PORT, () => {
      logger.info(`🚀 Meridian API running in ${config.NODE_ENV} mode on port ${config.PORT}`);
    });

    // ── Graceful Shutdown ──
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        // await prisma.$disconnect();
        // await redis.quit();
        // await kafka.disconnect();
        process.exit(0);
      });

      // Force close after 10s
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
