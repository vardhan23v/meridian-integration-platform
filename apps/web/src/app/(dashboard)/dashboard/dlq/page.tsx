import { type JSX } from 'react';
import DLQTable from '@/components/dlq/DLQTable';

export default function DLQPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Dead Letter Queue (DLQ)
        </h2>
      </div>

      <DLQTable />
    </div>
  );
}
