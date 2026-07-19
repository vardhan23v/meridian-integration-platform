import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: [
      { id: 'evt-1', type: 'System', status: 'failed', message: 'Connection timeout to SAP Gateway', timestamp: new Date().toISOString() },
      { id: 'evt-2', type: 'Pipeline', status: 'success', message: 'Pipeline "Customer Sync" completed successfully', timestamp: new Date(Date.now() - 50000).toISOString() },
      { id: 'evt-3', type: 'System', status: 'pending', message: 'High latency detected on Message Queue', timestamp: new Date(Date.now() - 150000).toISOString() },
      { id: 'evt-4', type: 'Deploy', status: 'success', message: 'New deployment v1.0.4 active', timestamp: new Date(Date.now() - 360000).toISOString() },
    ]
  });
}
