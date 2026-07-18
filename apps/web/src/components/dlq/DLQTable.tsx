'use client';

import { type JSX } from 'react';
import { AlertCircle, CheckCircle, Clock, FileText, RefreshCw, RotateCcw, Layers } from 'lucide-react';
import type { DLQMessage } from '@meridian/shared';
import { useDLQMessages, useRetryMessage, useResolveMessage } from '@/hooks/useDLQ';

function statusBadge(status: DLQMessage['status']): JSX.Element {
  const config: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    retrying: { label: 'Retrying', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    resolved: { label: 'Resolved', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    dead: { label: 'Dead', className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  };
  const { label, className } = config[status] ?? config.pending;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return dateStr;
  }
}

function truncatePayload(payload: string, maxLen = 80): string {
  if (payload.length <= maxLen) return payload;
  return payload.slice(0, maxLen) + '…';
}

export default function DLQTable(): JSX.Element {
  const { data: messages, isLoading, isError, error } = useDLQMessages();
  const retryMutation = useRetryMessage();
  const resolveMutation = useResolveMessage();

  if (isLoading) {
    return (
      <div className="glass border-white/10 p-8">
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="h-5 w-5 animate-spin text-indigo-400" />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading DLQ messages…</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass border-white/10 border-rose-500/30 p-8">
        <div className="flex flex-col items-center space-y-3 text-center">
          <AlertCircle className="h-8 w-8 text-rose-400" />
          <p className="text-sm font-medium text-rose-400">Failed to load DLQ messages</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {error?.message ?? 'An unexpected error occurred.'}
          </p>
        </div>
      </div>
    );
  }

  const messageList = messages ?? [];

  if (messageList.length === 0) {
    return (
      <div className="glass border-white/10 p-8">
        <div className="flex flex-col items-center space-y-3 text-center">
          <Layers className="h-8 w-8" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>DLQ is empty</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No dead-letter messages to display.</p>
        </div>
      </div>
    );
  }

  const isMutating = retryMutation.isPending || resolveMutation.isPending;

  return (
    <div className="glass border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                Message ID
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                Topic
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                Status
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                Error
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                Payload
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                Timestamp
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {messageList.map((msg) => (
              <tr
                key={msg.id}
                className="transition-colors hover:bg-white/5"
              >
                <td className="px-5 py-3.5">
                  <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs" style={{ color: 'var(--foreground)' }}>
                    {msg.id}
                  </code>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Layers className="h-3.5 w-3.5" />
                    {msg.topic}
                  </span>
                </td>
                <td className="px-5 py-3.5">{statusBadge(msg.status)}</td>
                <td className="px-5 py-3.5 max-w-[200px]">
                  <span className="text-xs text-rose-400 line-clamp-2" title={msg.error}>
                    {msg.error}
                  </span>
                </td>
                <td className="px-5 py-3.5 max-w-[200px]">
                  <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }} title={msg.payload}>
                    <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{truncatePayload(msg.payload)}</span>
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(msg.timestamp)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={isMutating || msg.status === 'resolved'}
                      onClick={() => retryMutation.mutate(msg.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Retry this message"
                    >
                      {retryMutation.isPending ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="h-3.5 w-3.5" />
                      )}
                      Retry
                    </button>
                    <button
                      type="button"
                      disabled={isMutating || msg.status === 'resolved'}
                      onClick={() => resolveMutation.mutate(msg.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Mark as resolved"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Resolve
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}