import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { correlationIdMiddleware } from './middlewares/correlationId';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import { globalRateLimiter } from './middlewares/rateLimiter';

const app: express.Express = express();

// ── Global Middlewares ──
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' })); // Support larger payloads for integration testing
app.use(express.urlencoded({ extended: true }));
app.use(correlationIdMiddleware);
app.use(requestLogger);
app.use('/api/', globalRateLimiter);

// ── Root ──
app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'Meridian Integration Platform API',
    version: '0.1.0',
    docs: '/api-docs',
    health: '/health/liveness',
    metrics: '/api/v1/metrics',
  });
});

// ── Health Probes (Kubernetes friendly) ──
app.get('/health/liveness', (_req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Note: Readiness probe will be added later when DB/Redis connections are established

import apiRouter from './routes/index';
import { dashboardRoutes } from './routes/dashboard';
import { setupSwagger } from './docs/swagger';

// ── Swagger UI ──
setupSwagger(app);

// ── API Routes ──
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/v1', apiRouter);

// ── Global Error Handler (Must be last) ──
app.use(errorHandler);

export default app;
