import { Router } from 'express';
import { IntegrationController } from '../controllers/IntegrationController';
import { ExtractionService } from '../services/ExtractionService';
import { SapConnector } from '../integrations/SapConnector';
import { JobRepository } from '../repositories/JobRepository';
import { AuditRepository } from '../repositories/AuditRepository';
import { prisma } from '../prisma/client';
import { requireAuth, requireRoles } from '../auth/rbac.middleware';
import { UserRole } from '@meridian/shared';

const router: Router = Router();

// DI wiring (manual for simplicity)
const sapConnector = new SapConnector();
const jobRepo = new JobRepository(prisma);
const auditRepo = new AuditRepository(prisma);
const extractionService = new ExtractionService(sapConnector, jobRepo, auditRepo);
const integrationController = new IntegrationController(extractionService);

router.post(
  '/extract',
  requireAuth,
  requireRoles([UserRole.SUPER_ADMIN, UserRole.SAP_ADMIN, UserRole.PLATFORM_ENGINEER]),
  integrationController.triggerExtraction
);

export { router as integrationRoutes };
