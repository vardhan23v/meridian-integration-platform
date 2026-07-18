import client from 'prom-client';
import { Router } from 'express';

// Create a Registry
const register = new client.Registry();

// Add default metrics (CPU, Memory, etc.)
client.collectDefaultMetrics({ register });

// Custom Metrics
export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestsTotal);

export const sapExtractionDuration = new client.Histogram({
  name: 'sap_extraction_duration_seconds',
  help: 'Duration of SAP Delta Extractions',
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
});
register.registerMetric(sapExtractionDuration);

// Metrics endpoint
const router: Router = Router();
router.get('/', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export { router as metricsRoute };
