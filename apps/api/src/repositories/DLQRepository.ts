import { prisma } from '../prisma/client';
import type { DLQMessage } from '@meridian/shared';

function toDomain(entry: {
  id: string;
  jobId: string;
  payload: any;
  errorCode: string;
  errorReason: string;
  retryCount: number;
  resolved: boolean;
  createdAt: Date;
}): DLQMessage {
  return {
    id: entry.id,
    topic: 'finsight.ready',
    partition: 0,
    offset: 0,
    payload: JSON.stringify(entry.payload),
    error: `${entry.errorCode}: ${entry.errorReason}`,
    timestamp: entry.createdAt.toISOString(),
    status: entry.resolved ? 'resolved' : entry.retryCount > 0 ? 'retrying' : 'pending',
    retryCount: entry.retryCount,
  };
}

export async function findAllDLQMessages(): Promise<DLQMessage[]> {
  const entries = await prisma.deadLetterQueue.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return entries.map(toDomain);
}

export async function retryDLQMessage(id: string): Promise<DLQMessage> {
  const entry = await prisma.deadLetterQueue.update({
    where: { id },
    data: { retryCount: { increment: 1 } },
  });
  return toDomain(entry);
}

export async function resolveDLQMessage(id: string): Promise<DLQMessage> {
  const entry = await prisma.deadLetterQueue.update({
    where: { id },
    data: { resolved: true },
  });
  return toDomain(entry);
}