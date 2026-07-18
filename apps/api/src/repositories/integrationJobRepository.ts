import { prisma } from '../prisma/client';
import type { IntegrationJob } from '@meridian/shared';

function toDomain(job: {
  id: string;
  companyId: string;
  jobType: string;
  status: string;
  totalRecords: number;
  startedAt: Date;
  completedAt: Date | null;
}): IntegrationJob {
  return {
    id: job.id,
    name: `${job.jobType} - ${job.companyId}`,
    status: mapStatus(job.status),
    source: 'SAP S/4HANA',
    destination: 'FinSight',
    lastRun: job.startedAt.toISOString(),
    nextRun: undefined,
    createdAt: job.startedAt.toISOString(),
  };
}

function mapStatus(prismaStatus: string): IntegrationJob['status'] {
  switch (prismaStatus) {
    case 'PENDING':
      return 'idle';
    case 'RUNNING':
      return 'running';
    case 'FAILED':
      return 'failed';
    case 'COMPLETED':
    case 'PARTIAL':
      return 'success';
    default:
      return 'idle';
  }
}

export async function findAllJobs(): Promise<IntegrationJob[]> {
  const jobs = await prisma.integrationJob.findMany({
    orderBy: { startedAt: 'desc' },
  });
  return jobs.map(toDomain);
}

export async function findJobById(id: string): Promise<IntegrationJob | null> {
  const job = await prisma.integrationJob.findUnique({ where: { id } });
  return job ? toDomain(job) : null;
}

export async function updateJobStatus(id: string, status: string): Promise<IntegrationJob> {
  const prismaStatus = mapDomainStatusToPrisma(status);
  const job = await prisma.integrationJob.update({
    where: { id },
    data: {
      status: prismaStatus,
      completedAt: ['COMPLETED', 'FAILED', 'PARTIAL'].includes(prismaStatus) ? new Date() : null,
    },
  });
  return toDomain(job);
}

function mapDomainStatusToPrisma(domainStatus: string): 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PARTIAL' {
  switch (domainStatus) {
    case 'idle':
      return 'PENDING';
    case 'running':
      return 'RUNNING';
    case 'failed':
      return 'FAILED';
    case 'success':
      return 'COMPLETED';
    default:
      return 'PENDING';
  }
}