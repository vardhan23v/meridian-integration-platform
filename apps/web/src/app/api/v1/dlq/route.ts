import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: [
      { id: 'dlq-1', topic: 'orders-topic', partition: 0, offset: '1240', payload: '{"orderId":"1001", "status":"pending"}', error: 'Timeout connecting to SAP Gateway', timestamp: new Date(Date.now() - 500000).toISOString(), status: 'pending', retryCount: 0 },
      { id: 'dlq-2', topic: 'customer-topic', partition: 1, offset: '849', payload: '{"customerId":"c-500", "action":"update"}', error: 'Invalid payload format', timestamp: new Date(Date.now() - 800000).toISOString(), status: 'dead', retryCount: 3 },
      { id: 'dlq-3', topic: 'inventory-topic', partition: 2, offset: '221', payload: '{"sku":"X123", "qty":0}', error: 'Database lock timeout', timestamp: new Date(Date.now() - 150000).toISOString(), status: 'pending', retryCount: 1 }
    ]
  });
}
