import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';

const connection = new IORedis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  maxRetriesPerRequest: null
});

connection.on('connect', () => {
  logger.info('✅ Redis connected');
});

connection.on('error', (err) => {
  logger.error({ err }, '❌ Redis connection error');
});

export const executionQueue = new Queue('execution-queue', {
  connection,
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: {
      count: 100,
      age: 3600
    },
    removeOnFail: {
      count: 500,
      age: 7200
    }
  }
});

export { connection };