'use client';

import { type JSX } from 'react';
import { Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
} from 'recharts';
import type { PipelineStatus } from '@meridian/shared';

interface PipelineCardProps {
  pipeline: PipelineStatus;
  delayClass: string;
}

const STATUS_CONFIG: Record<
  PipelineStatus['status'],
  { label: string; badge: string; dot: string }
> = {
  healthy: {
    label: 'Healthy',
    badge: 'bg-green-100 text-green-800',
    dot: 'bg-green-500',
  },
  warning: {
    label: 'Warning',
    badge: 'bg-yellow-100 text-yellow-800',
    dot: 'bg-yellow-500',
  },
  error: {
    label: 'Error',
    badge: 'bg-red-100 text-red-800',
    dot: 'bg-red-500',
  },
};

function generateSparklineData(throughput: number) {
  const points = 12;
  return Array.from({ length: points }, (_, i) => ({
    t: i,
    v: throughput * (0.6 + Math.random() * 0.8),
  }));
}

export default function PipelineCard({
  pipeline,
  delayClass,
}: PipelineCardProps): JSX.Element {
  const sparklineData = generateSparklineData(pipeline.throughput);
  const config = STATUS_CONFIG[pipeline.status];

  const formattedTime = new Date(pipeline.lastRun).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`glass border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fade-in-up ${delayClass}`}
    >
      <div className="p-5">
        {/* Section label */}
        <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
          Pipeline
        </span>

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-2.5 w-2.5 rounded-full ${config.dot} ring-2 ring-white/10`} />
            <h4 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              {pipeline.name}
            </h4>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badge}`}
          >
            {config.label}
          </span>
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

        {/* Sparkline section */}
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>
          Throughput
        </span>
        <div className="h-12 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
              <Line
                type="monotone"
                dataKey="v"
                stroke={
                  pipeline.status === 'error'
                    ? '#ef4444'
                    : pipeline.status === 'warning'
                      ? '#eab308'
                      : '#22c55e'
                }
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Divider */}
        <div className="my-3 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

        {/* Footer row */}
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            <span>{pipeline.throughput.toLocaleString()} rec/s</span>
          </div>
          <span>Last run: {formattedTime}</span>
        </div>
      </div>
    </div>
  );
}