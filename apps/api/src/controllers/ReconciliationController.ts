import { Request, Response, NextFunction } from 'express';
import { ReconciliationService } from '../services/ReconciliationService';
import { successResponse } from '../utils/response';

export class ReconciliationController {
  constructor(private reconService: ReconciliationService) {}

  startReconciliation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId } = req.body;
      const result = await this.reconService.reconcileJob(jobId);
      return successResponse(res, 202, 'Reconciliation completed', result);
    } catch (error) {
      next(error);
    }
  };

  getVariances = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.id as string;
      const result = await this.reconService.getVarianceReport(jobId);
      return successResponse(res, 200, 'Variance report fetched', result);
    } catch (error) {
      next(error);
    }
  };
}
