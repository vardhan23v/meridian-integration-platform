import { PrismaClient, JobStatus } from '@prisma/client';
import { logger } from '../utils/logger';

export class ReconciliationEngine {
  constructor(private prisma: PrismaClient) {}

  /**
   * Executes a full reconciliation for a given job.
   * Compares SAP Extracted counts vs FinSight Loaded counts.
   */
  async runReconciliation(jobId: string) {
    logger.info(`[Recon] Starting reconciliation for job: ${jobId}`);

    const job = await this.prisma.integrationJob.findUnique({
      where: { id: jobId },
      include: {
        auditEntries: true,
      },
    });

    if (!job) throw new Error('Job not found');

    const totalExtracted = job.totalRecords;
    const totalLoaded = job.auditEntries.filter(e => e.status === 'SUCCESS').length;
    const totalFailed = job.auditEntries.filter(e => e.status === 'ERROR').length;
    const totalPending = job.auditEntries.filter(e => e.status === 'RETRYING').length;

    const countVariance = totalExtracted - (totalLoaded + totalFailed + totalPending);

    if (countVariance !== 0) {
      logger.warn(`[Recon] Variance Detected for Job ${jobId}: Expected ${totalExtracted}, Found ${totalLoaded + totalFailed}`);
      
      // Here we would create VarianceReport entries in a real database,
      // but for this MVP scaffolding, we just log it and alert.
    }

    if (totalPending === 0 && totalFailed === 0 && countVariance === 0) {
      await this.prisma.integrationJob.update({
        where: { id: jobId },
        data: { status: JobStatus.COMPLETED, completedAt: new Date() }
      });
      logger.info(`[Recon] Job ${jobId} perfectly reconciled.`);
    } else if (totalPending === 0 && totalFailed > 0) {
      await this.prisma.integrationJob.update({
        where: { id: jobId },
        data: { status: JobStatus.PARTIAL, completedAt: new Date() }
      });
      logger.info(`[Recon] Job ${jobId} finished with partial success.`);
    }

    return {
      jobId,
      totalExtracted,
      totalLoaded,
      totalFailed,
      totalPending,
      countVariance,
      status: countVariance === 0 ? 'MATCHED' : 'VARIANCE_DETECTED'
    };
  }
}
