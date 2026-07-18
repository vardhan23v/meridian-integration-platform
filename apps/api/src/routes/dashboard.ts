import { Request, Response, Router } from 'express';
import type {
  DashboardOverview,
  DashboardMetrics,
  IntegrationEvent,
  PipelineStatus,
  ServiceHealth,
  MetricPoint,
} from '@meridian/shared';

const router: Router = Router();

// ── Mock Data ──

const mockPipelines: PipelineStatus[] = [
  {
    id: 'pipe-001',
    name: 'SAP FI-GL → FinSight',
    status: 'healthy',
    lastRun: new Date(Date.now() - 5 * 60_000).toISOString(),
    throughput: 1247,
  },
  {
    id: 'pipe-002',
    name: 'SAP CO-PA → FinSight',
    status: 'warning',
    lastRun: new Date(Date.now() - 12 * 60_000).toISOString(),
    throughput: 832,
  },
  {
    id: 'pipe-003',
    name: 'SAP MM → FinSight',
    status: 'healthy',
    lastRun: new Date(Date.now() - 3 * 60_000).toISOString(),
    throughput: 2104,
  },
  {
    id: 'pipe-004',
    name: 'SAP SD → FinSight',
    status: 'error',
    lastRun: new Date(Date.now() - 45 * 60_000).toISOString(),
    throughput: 0,
  },
];

const mockServices: ServiceHealth[] = [
  { name: 'API Gateway', status: 'up', latency: 12, uptime: '14d 6h 23m' },
  { name: 'PostgreSQL', status: 'up', latency: 3, uptime: '30d 2h 11m' },
  { name: 'Redis', status: 'up', latency: 1, uptime: '30d 2h 10m' },
  { name: 'Redpanda (Kafka)', status: 'up', latency: 8, uptime: '30d 2h 9m' },
  { name: 'SAP ODP Connector', status: 'degraded', latency: 245, uptime: '7d 14h 5m' },
];

const mockEvents: IntegrationEvent[] = [
  {
    id: 'evt-001',
    type: 'sync.completed',
    status: 'success',
    message: 'FI-GL delta sync completed: 1,247 records',
    timestamp: new Date(Date.now() - 5 * 60_000).toISOString(),
  },
  {
    id: 'evt-002',
    type: 'sync.completed',
    status: 'success',
    message: 'MM inventory sync completed: 2,104 records',
    timestamp: new Date(Date.now() - 3 * 60_000).toISOString(),
  },
  {
    id: 'evt-003',
    type: 'sync.warning',
    status: 'pending',
    message: 'CO-PA sync delayed: source system throttling',
    timestamp: new Date(Date.now() - 12 * 60_000).toISOString(),
  },
  {
    id: 'evt-004',
    type: 'sync.failed',
    status: 'failed',
    message: 'SD billing extraction failed: ODP context expired',
    timestamp: new Date(Date.now() - 45 * 60_000).toISOString(),
  },
  {
    id: 'evt-005',
    type: 'connection.restored',
    status: 'success',
    message: 'SAP ODP connection restored after transient failure',
    timestamp: new Date(Date.now() - 90 * 60_000).toISOString(),
  },
  {
    id: 'evt-006',
    type: 'reconciliation.run',
    status: 'success',
    message: 'Daily reconciliation: 0 variances found',
    timestamp: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: 'evt-007',
    type: 'sync.completed',
    status: 'success',
    message: 'FI-GL delta sync completed: 1,189 records',
    timestamp: new Date(Date.now() - 65 * 60_000).toISOString(),
  },
  {
    id: 'evt-008',
    type: 'sync.warning',
    status: 'pending',
    message: 'MM material master sync: 3 records skipped (validation)',
    timestamp: new Date(Date.now() - 110 * 60_000).toISOString(),
  },
];

function generateMetricPoints(
  count: number,
  baseValue: number,
  variance: number,
  intervalMs: number,
): MetricPoint[] {
  const points: MetricPoint[] = [];
  const now = Date.now();
  for (let i = count - 1; i >= 0; i--) {
    const ts = new Date(now - i * intervalMs).toISOString();
    const value = Math.round((baseValue + (Math.random() - 0.5) * variance) * 100) / 100;
    points.push({ timestamp: ts, value });
  }
  return points;
}

// ── GET /api/v1/dashboard/overview ──

async function getDashboardOverview(_req: Request, res: Response): Promise<void> {
  const overview: DashboardOverview = {
    pipelines: mockPipelines,
    services: mockServices,
    events: mockEvents.slice(0, 5),
    stats: {
      totalPipelines: mockPipelines.length,
      activePipelines: mockPipelines.filter((p) => p.status !== 'error').length,
      totalEvents: mockEvents.length,
      failedEvents: mockEvents.filter((e) => e.status === 'failed').length,
    },
  };

  res.json({
    success: true,
    statusCode: 200,
    message: 'Dashboard overview retrieved',
    data: overview,
    timestamp: new Date().toISOString(),
  });
}

// ── GET /api/v1/dashboard/metrics?range=1h|6h|24h|7d ──

async function getDashboardMetrics(req: Request, res: Response): Promise<void> {
  const range = (req.query.range as string) || '1h';

  const rangeConfig: Record<string, { points: number; intervalMs: number }> = {
    '1h': { points: 60, intervalMs: 60_000 },
    '6h': { points: 72, intervalMs: 5 * 60_000 },
    '24h': { points: 96, intervalMs: 15 * 60_000 },
    '7d': { points: 84, intervalMs: 2 * 3600_000 },
  };

  const config = rangeConfig[range] ?? rangeConfig['1h'];

  const metrics: DashboardMetrics = {
    pipelineThroughput: generateMetricPoints(config.points, 1500, 400, config.intervalMs),
    serviceLatency: generateMetricPoints(config.points, 45, 30, config.intervalMs),
    eventVolume: generateMetricPoints(config.points, 80, 40, config.intervalMs),
  };

  res.json({
    success: true,
    statusCode: 200,
    message: `Dashboard metrics for range: ${range}`,
    data: metrics,
    timestamp: new Date().toISOString(),
  });
}

// ── GET /api/v1/dashboard/events?limit=10 ──

async function getDashboardEvents(req: Request, res: Response): Promise<void> {
  const limit = Math.min(Math.max(parseInt(req.query.limit as string, 10) || 10, 1), 100);

  const events = mockEvents.slice(0, limit);

  res.json({
    success: true,
    statusCode: 200,
    message: `Dashboard events retrieved (limit: ${limit})`,
    data: events,
    timestamp: new Date().toISOString(),
  });
}

// ── Routes ──

router.get('/overview', getDashboardOverview);
router.get('/metrics', getDashboardMetrics);
router.get('/events', getDashboardEvents);

export { router as dashboardRoutes };