'use client';

import { useEffect, useState, type JSX } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ComponentType<{ className?: string }>;
  accent?: 'indigo' | 'emerald' | 'amber' | 'rose';
  className?: string;
}

const ACCENT_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  indigo:  { bg: 'bg-indigo-500/10', text: 'text-indigo-400', glow: 'rgba(99,102,241,0.15)' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'rgba(34,197,94,0.15)' },
  amber:   { bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'rgba(251,191,36,0.15)' },
  rose:    { bg: 'bg-rose-500/10', text: 'text-rose-400', glow: 'rgba(239,68,68,0.15)' },
};

export default function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  accent = 'indigo',
  className,
}: StatCardProps): JSX.Element {
  const [visible, setVisible] = useState(false);
  const colors = ACCENT_COLORS[accent] ?? ACCENT_COLORS.indigo;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`glass border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${className ?? ''}`}
    >
      <div className="p-5">
        {/* Section label */}
        <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
          {title}
        </span>

        <div className="flex items-center">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${colors.bg} ring-1 ring-white/10`}
          >
            <Icon className={`h-5 w-5 ${colors.text}`} />
          </div>
          <div className="ml-4 w-0 flex-1">
            <dl>
              <dd
                className={`text-[1.75rem] font-bold leading-none tracking-tight transition-opacity duration-500 ${
                  visible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ color: 'var(--foreground)' }}
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
              </dd>
            </dl>
          </div>
        </div>

        {trend !== undefined && (
          <>
            <div className="my-3 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
            <div className="flex items-center text-sm">
              <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>Trend</span>
              {trend >= 0 ? (
                <TrendingUp className="mr-1 h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4 text-red-400" />
              )}
              <span
                className={
                  trend >= 0 ? 'text-green-400' : 'text-red-400'
                }
              >
                {trend >= 0 ? '+' : ''}
                {trend}%
              </span>
              <span className="ml-1" style={{ color: 'var(--text-muted)' }}>vs last period</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}