import { type JSX } from 'react';
import IntegrationJobsTable from '@/components/jobs/IntegrationJobsTable';

export default function JobsPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Integration Jobs
        </h2>
      </div>

      <IntegrationJobsTable />
    </div>
  );
}