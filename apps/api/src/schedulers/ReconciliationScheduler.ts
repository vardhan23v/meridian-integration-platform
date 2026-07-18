import cron from 'node-cron';
import { PrismaClient, JobStatus } from '@prisma/client';
import { ReconciliationService } from '../services/ReconciliationService';
import { logger } from '../utils/logger';

export const initSchedulers = (prisma: PrismaClient) => {
  const reconService = new ReconciliationService(prisma);

  // Run every night at 05:00 IST (05:00 in Asia/Kolkata)
  // This allows the 01:00 - 04:30 IST batch window to complete.
  cron.schedule('0 5 * * *', async () => {
    logger.info('[Scheduler] Initiating Nightly Reconciliation Batch');

    try {
      // Find all RUNNING or PENDING jobs older than 4 hours
      const staleJobs = await prisma.integrationJob.findMany({
        where: {
          status: { in: [JobStatus.RUNNING, JobStatus.PENDING] },
          startedAt: { lte: new Date(Date.now() - 4 * 60 * 60 * 1000) }
        }
      });

      for (const job of staleJobs) {
        await reconService.reconcileJob(job.id);
      }
      
      logger.info(`[Scheduler] Nightly Reconciliation finished. Processed ${staleJobs.length} jobs.`);
    } catch (error: any) {
      logger.error(`[Scheduler] Nightly Reconciliation failed: ${error.message}`);
    }
  }, {
    timezone: 'Asia/Kolkata',
  });

  logger.info('Schedulers initialized.');
};
