import { NextResponse } from 'next/server';

export async function GET() {
  const now = Date.now();
  return NextResponse.json({
    data: {
      pipelineThroughput: [
        { timestamp: new Date(now - 7 * 60000).toISOString(), value: 820 },
        { timestamp: new Date(now - 6 * 60000).toISOString(), value: 1050 },
        { timestamp: new Date(now - 5 * 60000).toISOString(), value: 1200 },
        { timestamp: new Date(now - 4 * 60000).toISOString(), value: 950 },
        { timestamp: new Date(now - 3 * 60000).toISOString(), value: 1350 },
        { timestamp: new Date(now - 2 * 60000).toISOString(), value: 1100 },
        { timestamp: new Date(now - 1 * 60000).toISOString(), value: 1500 },
        { timestamp: new Date(now).toISOString(), value: 1800 },
      ],
      serviceLatency: [
        { timestamp: new Date(now - 7 * 60000).toISOString(), value: 55 },
        { timestamp: new Date(now - 6 * 60000).toISOString(), value: 42 },
        { timestamp: new Date(now - 5 * 60000).toISOString(), value: 78 },
        { timestamp: new Date(now - 4 * 60000).toISOString(), value: 250 },
        { timestamp: new Date(now - 3 * 60000).toISOString(), value: 180 },
        { timestamp: new Date(now - 2 * 60000).toISOString(), value: 95 },
        { timestamp: new Date(now - 1 * 60000).toISOString(), value: 45 },
        { timestamp: new Date(now).toISOString(), value: 12 },
      ],
      eventVolume: [
        { timestamp: new Date(now - 7 * 60000).toISOString(), value: 80 },
        { timestamp: new Date(now - 6 * 60000).toISOString(), value: 120 },
        { timestamp: new Date(now - 5 * 60000).toISOString(), value: 150 },
        { timestamp: new Date(now - 4 * 60000).toISOString(), value: 90 },
        { timestamp: new Date(now - 3 * 60000).toISOString(), value: 200 },
        { timestamp: new Date(now - 2 * 60000).toISOString(), value: 170 },
        { timestamp: new Date(now - 1 * 60000).toISOString(), value: 130 },
        { timestamp: new Date(now).toISOString(), value: 210 },
      ]
    }
  });
}
