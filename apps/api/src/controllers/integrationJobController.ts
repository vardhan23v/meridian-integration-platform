import { Request, Response, NextFunction } from 'express';
import { findAllJobs, findJobById, updateJobStatus } from '../repositories/integrationJobRepository';
import { successResponse } from '../utils/response';
import { NotFoundException, ValidationException } from '../exceptions';
import { z } from 'zod';

const triggerJobSchema = z.object({
  companyId: z.string().min(1),
  jobType: z.string().min(1),
});

export async function listJobs(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const jobs = await findAllJobs();
    successResponse(res, 200, 'Jobs retrieved', jobs);
  } catch (error) {
    next(error);
  }
}

export async function getJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const job = await findJobById(id);
    if (!job) {
      throw new NotFoundException(`Job ${id} not found`);
    }
    successResponse(res, 200, 'Job retrieved', job);
  } catch (error) {
    next(error);
  }
}

export async function triggerJob(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = triggerJobSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationException('Invalid job payload', parsed.error.format());
    }

    const { companyId } = parsed.data;
    const job = await updateJobStatus(companyId, 'running');
    successResponse(res, 202, 'Job triggered', { jobId: job.id, status: job.status });
  } catch (error) {
    next(error);
  }
}