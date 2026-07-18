import { Request, Response, NextFunction } from 'express';
import { ExtractionService } from '../services/ExtractionService';
import { successResponse } from '../utils/response';
import { z } from 'zod';
import { ValidationException } from '../exceptions';

const extractSchema = z.object({
  companyCode: z.string().length(4),
  fiscalYear: z.string().length(4),
});

export class IntegrationController {
  constructor(private extractionService: ExtractionService) {}

  /**
   * @openapi
   * /api/v1/integrations/extract:
   *   post:
   *     summary: Trigger an SAP Delta Extraction
   *     tags: [Integrations]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [companyCode, fiscalYear]
   *             properties:
   *               companyCode:
   *                 type: string
   *               fiscalYear:
   *                 type: string
   *     responses:
   *       202:
   *         description: Extraction job queued successfully
   */
  triggerExtraction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = extractSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationException('Invalid extraction payload', parsed.error.format());
      }

      const { companyCode, fiscalYear } = parsed.data;
      const jobId = await this.extractionService.startDeltaExtraction(companyCode, fiscalYear);

      return successResponse(res, 202, 'Extraction job queued', { jobId });
    } catch (error) {
      next(error);
    }
  };
}
