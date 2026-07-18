import { kafka } from '../client';
import { KAFKA_TOPICS } from '../../constants';
import { TransformationService } from '../../services/TransformationService';
import { ValidationService } from '../../services/ValidationService';
import { publishEvent } from '../producer';
import { logger } from '../../utils/logger';

const consumer = kafka.consumer({ groupId: 'meridian-extraction-group' });
const transformService = new TransformationService();
const validationService = new ValidationService();

export const startExtractionConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: KAFKA_TOPICS.SAP_RAW, fromBeginning: false });

  logger.info('Extraction Consumer started on topic: ' + KAFKA_TOPICS.SAP_RAW);

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const { jobId, payload } = JSON.parse(message.value.toString());

      try {
        // 1. Validate
        const validRecord = validationService.validateRawRecord(payload);
        
        // 2. Transform
        const transformedRecord = transformService.transform(validRecord);

        // 3. Publish to next stage
        await publishEvent(KAFKA_TOPICS.FINSIGHT_READY, transformedRecord.transactionId, {
          jobId,
          payload: transformedRecord,
        });

      } catch (error: any) {
        logger.error(`Transformation failed for job ${jobId}`, { error: error.message });
        
        // Send to DLQ via Event
        await publishEvent(KAFKA_TOPICS.DLQ, payload.BELNR || 'UNKNOWN', {
          jobId,
          payload,
          errorCode: error.errorCode || 'TRANSFORM_ERROR',
          errorReason: error.message,
        });
      }
    },
  });
};
