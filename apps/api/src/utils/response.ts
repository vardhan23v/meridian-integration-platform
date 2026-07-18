import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '@meridian/shared';

export const successResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: PaginationMeta
) => {
  const correlationId = res.getHeader('x-correlation-id') as string;
  const payload: ApiResponse<T> = {
    success: true,
    statusCode,
    message,
    data,
    meta,
    correlationId,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(payload);
};
