import { kafka } from '../client';
import { KAFKA_TOPICS } from '../../constants';
import { FinSightClient } from '../../integrations/FinSightClient';
import { AuditRepository } from '../../repositories/AuditRepository';
import { prisma } from '../../prisma/client';
import { logger } from '../../utils/logger';
import { CanonicalFinancialRecord } from '@meridian/shared';

const consumer = kafka.consumer({ groupId: 'meridian-loader-group' });
const finSightClient = new FinSightClient();
const auditRepo = new AuditRepository(prisma);

export const startLoaderConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: KAFKA_TOPICS.FINSIGHT_READY, fromBeginning: false });

  logger.info('Loader Consumer started on topic: ' + KAFKA_TOPICS.FINSIGHT_READY);

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const { jobId, payload } = JSON.parse(message.value.toString()) as { 
        jobId: string, 
        payload: CanonicalFinancialRecord 
      };

      try {
        // 1. Send to FinSight
        const response = await finSightClient.upsertJournalEntry(payload);

        // 2. Update Audit DB inside a transaction logic (simulated with updateMany for speed)
        await auditRepo.markAsSuccess(
          jobId,
          payload.transactionId.split('-')[1], // BELNR
          response.id
        );

      } catch (error: any) {
        logger.error(`Loader failed for ${payload.transactionId}`, { error: error.message });
        
        await auditRepo.markAsError(
          jobId,
          payload.transactionId.split('-')[1]
        );
      }
    },
  });
};
