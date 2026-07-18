import { PrismaClient, AuditEntry, SyncStatus } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

export class AuditRepository extends BaseRepository<AuditEntry> {
  constructor(prisma: PrismaClient) {
    super(prisma, prisma.auditEntry);
  }

  /**
   * Bulk insert audit entries (highly optimized for 10k+ records)
   */
  async createMany(data: Omit<AuditEntry, 'id' | 'createdAt'>[]): Promise<number> {
    const result = await this.prisma.auditEntry.createMany({
      data,
      skipDuplicates: true,
    });
    return result.count;
  }

  async findByJobId(jobId: string, skip: number = 0, take: number = 100): Promise<AuditEntry[]> {
    return this.prisma.auditEntry.findMany({
      where: { jobId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsSuccess(jobId: string, sapDocNo: string, finsightId: string): Promise<void> {
    await this.prisma.auditEntry.updateMany({
      where: { jobId, sapDocNo },
      data: { status: SyncStatus.SUCCESS, finsightId },
    });
  }

  async markAsError(jobId: string, sapDocNo: string): Promise<void> {
    await this.prisma.auditEntry.updateMany({
      where: { jobId, sapDocNo },
      data: { status: SyncStatus.ERROR },
    });
  }
}
