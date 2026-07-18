import { Producer } from 'kafkajs';
import { kafka } from './client';
import { logger } from '../utils/logger';

export const producer: Producer = kafka.producer({
  idempotent: true,
  maxInFlightRequests: 1, // Required for exact-once semantics with idempotence
});

export const connectProducer = async () => {
  await producer.connect();
  logger.info('Kafka Producer connected');
};

export const disconnectProducer = async () => {
  await producer.disconnect();
};

export const publishEvent = async (topic: string, key: string, payload: any) => {
  try {
    await producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(payload) }],
    });
    logger.debug(`Published to ${topic} [${key}]`);
  } catch (error: any) {
    logger.error(`Failed to publish to ${topic}: ${error.message}`);
    throw error;
  }
};
