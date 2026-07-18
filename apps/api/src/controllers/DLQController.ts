import { Request, Response, NextFunction } from 'express';
import { findAllDLQMessages, retryDLQMessage, resolveDLQMessage } from '../repositories/DLQRepository';
import { successResponse } from '../utils/response';


export async function listDLQ(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const messages = await findAllDLQMessages();
    successResponse(res, 200, 'DLQ messages retrieved', messages);
  } catch (error) {
    next(error);
  }
}

export async function retryMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const message = await retryDLQMessage(id);
    successResponse(res, 200, 'Message retried', { messageId: message.id, status: message.status });
  } catch (error) {
    next(error);
  }
}

export async function resolveMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const message = await resolveDLQMessage(id);
    successResponse(res, 200, 'Message resolved', { messageId: message.id, status: message.status });
  } catch (error) {
    next(error);
  }
}