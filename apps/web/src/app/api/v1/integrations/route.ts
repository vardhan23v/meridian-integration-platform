import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: [
      { id: 'j1', name: 'Customer Sync', status: 'idle', source: 'Salesforce', destination: 'SAP', lastRun: new Date(Date.now() - 3600000).toISOString(), nextRun: new Date(Date.now() + 3600000).toISOString(), createdAt: new Date().toISOString() },
      { id: 'j2', name: 'Order Processing', status: 'running', source: 'Stripe', destination: 'NetSuite', lastRun: new Date(Date.now() - 7200000).toISOString(), nextRun: new Date(Date.now() + 1800000).toISOString(), createdAt: new Date().toISOString() },
      { id: 'j3', name: 'Inventory Update', status: 'failed', source: 'Shopify', destination: 'SAP', lastRun: new Date(Date.now() - 100000).toISOString(), nextRun: new Date(Date.now() + 7200000).toISOString(), createdAt: new Date().toISOString() }
    ]
  });
}
