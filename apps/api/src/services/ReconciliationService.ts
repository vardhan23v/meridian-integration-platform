import { ReconciliationEngine } from '../reconciliation/ReconciliationEngine';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

export class ReconciliationService {
  private engine: ReconciliationEngine;

  constructor(prisma: PrismaClient) {
    this.engine = new ReconciliationEngine(prisma);
  }

  async reconcileJob(jobId: string) {
    try {
      return await this.engine.runReconciliation(jobId);
    } catch (error: any) {
      logger.error(`Failed to reconcile job ${jobId}: ${error.message}`);
      throw error;
    }
  }

  async getVarianceReport(jobId: string) {
    // Simulated read from a VarianceReport table
    return {
      jobId,
      variances: [
        {
          id: 'var_1',
          type: 'COUNT',
          expected: 100,
          actual: 98,
          status: 'OPEN'
        }
      ]
    };
  }
}
