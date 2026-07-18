import { Request, Response, NextFunction } from 'express';
import { DLQRepository } from '../repositories/DLQRepository';
import { successResponse } from '../utils/response';
import { NotFoundException } from '../exceptions';
import { logger } from '../utils/logger';

export class DLQController {
  constructor(private dlqRepo: DLQRepository) {}

  /**
   * GET /api/v1/dlq — list unresolved DLQ entries
   */
  listEntries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 50));
      const skip = (page - 1) * limit;

      const [entries, total] = await Promise.all([
        this.dlqRepo.findUnresolved(skip, limit),
        this.dlqRepo.countUnresolved(),
      ]);

      return successResponse(res, 200, 'DLQ entries retrieved', {
        entries,
        total,
      }, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/dlq/:id/retry — increment retry count and re-publish to Kafka
   */
  retryEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const entry = await this.dlqRepo.findById(id);
      if (!entry) {
        throw new NotFoundException(`DLQ entry ${id} not found`);
      }

      if (entry.resolved) {
        return successResponse(res, 200, 'DLQ entry already resolved', entry);
      }

      const updated = await this.dlqRepo.incrementRetry(id);

      // In production, re-publish to Kafka here:
      // await publishEvent(KAFKA_TOPICS.SAP_RAW, `${entry.jobId}-retry-${updated.retryCount}`, entry.payload);

      logger.info(`DLQ entry ${id} retried (attempt #${updated.retryCount})`);

      return successResponse(res, 202, 'DLQ entry queued for retry', updated);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/dlq/:id/resolve — mark DLQ entry as resolved
   */
  resolveEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const entry = await this.dlqRepo.findById(id);
      if (!entry) {
        throw new NotFoundException(`DLQ entry ${id} not found`);
      }

      const updated = await this.dlqRepo.markResolved(id);

      logger.info(`DLQ entry ${id} resolved`);

      return successResponse(res, 200, 'DLQ entry resolved', updated);
    } catch (error) {
      next(error);
    }
  };
}