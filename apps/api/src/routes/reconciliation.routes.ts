import { Router } from 'express';
import { ReconciliationController } from '../controllers/ReconciliationController';
import { ReconciliationService } from '../services/ReconciliationService';
import { prisma } from '../prisma/client';
import { requireAuth } from '../auth/rbac.middleware';

const router: Router = Router();
const reconService = new ReconciliationService(prisma);
const reconController = new ReconciliationController(reconService);

router.post('/start', requireAuth, reconController.startReconciliation);
router.get('/:id/variances', requireAuth, reconController.getVariances);

export { router as reconciliationRoutes };
