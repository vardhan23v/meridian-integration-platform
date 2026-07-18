import { Request, Response, NextFunction } from 'express';
import { generateCorrelationId } from '@meridian/shared';

export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'] || generateCorrelationId();
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
};
