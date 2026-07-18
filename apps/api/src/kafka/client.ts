import { Kafka, logLevel } from 'kafkajs';
import { config } from '../config/env';
import { logger } from '../utils/logger';

const winstonCreator = (_level: logLevel) => {
  return ({ namespace, level: _level2, label: _label, log }: any) => {
    const { message, ...extra } = log;
    logger.debug(`[KafkaJS ${namespace}] ${message}`, extra);
  };
};

export const kafka = new Kafka({
  clientId: config.KAFKA_CLIENT_ID,
  brokers: config.KAFKA_BROKERS.split(','),
  logLevel: logLevel.ERROR,
  logCreator: winstonCreator,
});

export const connectKafka = async () => {
  try {
    const admin = kafka.admin();
    await admin.connect();
    logger.info('Kafka connected successfully');
    await admin.disconnect();
  } catch (error) {
    logger.error('Failed to connect to Kafka:', error);
  }
};
