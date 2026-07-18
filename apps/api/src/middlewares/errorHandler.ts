import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../exceptions';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const correlationId = req.headers['x-correlation-id'] as string;

  if (err instanceof BaseException) {
    logger.warn(`[${correlationId}] API Exception: ${err.errorCode} - ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      error: err.errorCode,
      ...(err as any).details && { details: (err as any).details },
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }

  logger.error(`[${correlationId}] Unhandled Error: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Internal Server Error',
    error: 'INTERNAL_ERROR',
    correlationId,
    timestamp: new Date().toISOString(),
  });
};
