import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: {
      stats: {
        totalPipelines: 42,
        activePipelines: 38,
        totalEvents: 125430,
        failedEvents: 142
      },
      pipelines: [
        { id: 'p-1', name: 'SAP Orders to FinSight', status: 'healthy', lastRun: new Date().toISOString(), throughput: 1200 },
        { id: 'p-2', name: 'Customer Sync', status: 'healthy', lastRun: new Date().toISOString(), throughput: 300 },
        { id: 'p-3', name: 'Inventory Update', status: 'error', lastRun: new Date().toISOString(), throughput: 0 },
      ],
      services: [
        { name: 'SAP Gateway', status: 'up', latency: 45, uptime: '99.9%' },
        { name: 'FinSight API', status: 'up', latency: 85, uptime: '99.9%' },
        { name: 'Message Queue', status: 'degraded', latency: 250, uptime: '98.5%' },
      ],
      events: []
    }
  });
}
