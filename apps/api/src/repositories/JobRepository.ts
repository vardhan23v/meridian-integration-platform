import { PrismaClient, IntegrationJob, JobStatus } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

export class JobRepository extends BaseRepository<IntegrationJob> {
  constructor(prisma: PrismaClient) {
    super(prisma, prisma.integrationJob);
  }

  async createJob(companyId: string, jobType: string, totalRecords: number): Promise<IntegrationJob> {
    return this.prisma.integrationJob.create({
      data: {
        companyId,
        jobType,
        totalRecords,
        status: JobStatus.RUNNING,
      },
    });
  }

  async updateJobStatus(id: string, status: JobStatus): Promise<IntegrationJob> {
    return this.prisma.integrationJob.update({
      where: { id },
      data: { 
        status,
        completedAt: ['COMPLETED', 'FAILED', 'PARTIAL'].includes(status) ? new Date() : null 
      },
    });
  }
}
