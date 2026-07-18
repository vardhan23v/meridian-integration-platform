import { SapConnector } from '../integrations/SapConnector';
import { JobRepository } from '../repositories/JobRepository';
import { AuditRepository } from '../repositories/AuditRepository';
import { JobStatus, SyncStatus } from '@prisma/client';
import { publishEvent } from '../kafka/producer';
import { KAFKA_TOPICS } from '../constants';
import { logger } from '../utils/logger';

export class ExtractionService {
  constructor(
    private sapConnector: SapConnector,
    private jobRepo: JobRepository,
    private auditRepo: AuditRepository
  ) {}

  /**
   * Triggers a delta extraction from SAP and publishes raw events to Kafka.
   */
  async startDeltaExtraction(companyCode: string, fiscalYear: string): Promise<string> {
    // 1. Create Job Record
    const job = await this.jobRepo.createJob(companyCode, 'DELTA', 0);
    logger.info(`Started Delta Extraction Job: ${job.id}`);

    try {
      // 2. Fetch from SAP
      const records = await this.sapConnector.extractDelta(companyCode, fiscalYear);

      // 3. Update Job Record Total
      await this.jobRepo.update(job.id, { totalRecords: records.length });

      // 4. Create Audit Entries (Batch Insert)
      if (records.length > 0) {
        const auditData = records.map(r => ({
          jobId: job.id,
          sapDocNo: r.BELNR,
          fiscalYear: r.GJAHR,
          finsightId: null,
          status: SyncStatus.RETRYING, // Initial state until FinSight confirms
        }));
        await this.auditRepo.createMany(auditData);

        // 5. Publish to Kafka for downstream transformation
        for (const record of records) {
          const key = `${record.BUKRS}-${record.BELNR}-${record.GJAHR}`;
          await publishEvent(KAFKA_TOPICS.SAP_RAW, key, { jobId: job.id, payload: record });
        }
      }

      // We do not mark the job COMPLETED here, as downstream processes are async
      return job.id;
    } catch (error: any) {
      logger.error(`Job ${job.id} failed during SAP extraction: ${error.message}`);
      await this.jobRepo.updateJobStatus(job.id, JobStatus.FAILED);
      throw error;
    }
  }
}
