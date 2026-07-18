'use client';

import { type JSX } from 'react';
import { Clock, Activity } from 'lucide-react';
import type { ServiceHealth } from '@meridian/shared';

interface ServiceHealthGridProps {
  services: ServiceHealth[];
}

const STATUS_CONFIG: Record<
  ServiceHealth['status'],
  { label: string; dot: string; pulse: boolean; bar: string; text: string }
> = {
  up: {
    label: 'Up',
    dot: 'bg-green-500',
    pulse: true,
    bar: 'bg-green-500',
    text: 'text-green-700',
  },
  down: {
    label: 'Down',
    dot: 'bg-red-500',
    pulse: false,
    bar: 'bg-red-500',
    text: 'text-red-700',
  },
  degraded: {
    label: 'Degraded',
    dot: 'bg-yellow-500',
    pulse: false,
    bar: 'bg-yellow-500',
    text: 'text-yellow-700',
  },
};

function latencyBarWidth(latency: number): number {
  // Map latency (ms) to a percentage: 0ms → 5%, 500ms+ → 100%
  return Math.min(100, Math.max(5, (latency / 500) * 100));
}

function latencyColor(latency: number): string {
  if (latency < 100) return 'bg-green-500';
  if (latency < 300) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function ServiceHealthGrid({
  services,
}: ServiceHealthGridProps): JSX.Element {
  return (
    <div className="animate-fade-in-up">
      <h3 className="mb-4 text-lg font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
        Service Health
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => {
          const config = STATUS_CONFIG[service.status];
          const barPct = latencyBarWidth(service.latency);
          const barColor = latencyColor(service.latency);

          return (
            <div
              key={service.name}
              className="glass border-white/10 group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="p-5">
                {/* Section label */}
                <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
                  Service
                </span>

                {/* Header: name + status dot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3 items-center justify-center">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full ${config.dot} ring-2 ring-white/10 ${
                          config.pulse ? 'animate-pulse' : ''
                        }`}
                      />
                    </div>
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      {service.name}
                    </h4>
                  </div>
                  <span className={`text-xs font-medium ${config.text}`}>
                    {config.label}
                  </span>
                </div>

                {/* Divider */}
                <div className="my-3 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

                {/* Latency bar */}
                <div>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">Latency</span>
                    </div>
                    <span className="font-mono font-medium" style={{ color: 'var(--text-soft)' }}>
                      {service.latency} ms
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="my-3 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

                {/* Uptime */}
                <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">Uptime: </span>
                  <span className="font-medium" style={{ color: 'var(--text-soft)' }}>
                    {service.uptime}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}