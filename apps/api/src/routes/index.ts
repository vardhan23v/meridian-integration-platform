import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { integrationRoutes } from './integration.routes';
import { reconciliationRoutes } from './reconciliation.routes';
import { metricsRoute } from '../monitoring/prometheus';
import { dashboardRoutes } from './dashboard';

const apiRouter: Router = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/integrations', integrationRoutes);
apiRouter.use('/reconciliations', reconciliationRoutes);
apiRouter.use('/metrics', metricsRoute);
apiRouter.use('/dashboard', dashboardRoutes);

export default apiRouter;
