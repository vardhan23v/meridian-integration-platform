'use client';

import { type JSX } from 'react';
import { Clock, Play, RefreshCw, Server, ArrowRight, AlertCircle } from 'lucide-react';
import type { IntegrationJob } from '@meridian/shared';
import { useIntegrationJobs, useTriggerJob } from '@/hooks/useIntegrationJobs';

function statusBadge(status: IntegrationJob['status']): JSX.Element {
  const config: Record<string, { label: string; className: string }> = {
    idle: { label: 'Idle', className: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
    running: { label: 'Running', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    failed: { label: 'Failed', className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    success: { label: 'Success', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  };
  const { label, className } = config[status] ?? config.idle;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return dateStr;
  }
}

export default function IntegrationJobsTable(): JSX.Element {
  const { data: jobs, isLoading, isError, error } = useIntegrationJobs();
  const triggerMutation = useTriggerJob();

  if (isLoading) {
    return (
      <div className="glass border-white/10 p-8">
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="h-5 w-5 animate-spin text-indigo-400" />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading integration jobs…</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass border-white/10 border-rose-500/30 p-8">
        <div className="flex flex-col items-center space-y-3 text-center">
          <AlertCircle className="h-8 w-8 text-rose-400" />
          <p className="text-sm font-medium text-rose-400">Failed to load integration jobs</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {error?.message ?? 'An unexpected error occurred.'}
          </p>
        </div>
      </div>
    );
  }

  const jobList = jobs ?? [];

  if (jobList.length === 0) {
    return (
      <div className="glass border-white/10 p-8">
        <div className="flex flex-col items-center space-y-3 text-center">
          <Server className="h-8 w-8" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No integration jobs found</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Configured jobs will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                Job Name
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                Status
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                Source → Destination
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                Last Run
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                Next Run
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {jobList.map((job) => (
              <tr
                key={job.id}
                className="transition-colors hover:bg-white/5"
              >
                <td className="px-5 py-3.5 font-medium" style={{ color: 'var(--foreground)' }}>
                  {job.name}
                </td>
                <td className="px-5 py-3.5">{statusBadge(job.status)}</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {job.source}
                    <ArrowRight className="h-3 w-3" />
                    {job.destination}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(job.lastRun)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(job.nextRun)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    disabled={triggerMutation.isPending}
                    onClick={() => triggerMutation.mutate(job.name)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-400 transition-colors hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {triggerMutation.isPending ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                    Trigger
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}