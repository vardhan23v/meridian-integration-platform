'use client';

import { useEffect, useRef, useState, type JSX } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import type { IntegrationEvent } from '@meridian/shared';

interface EventsFeedProps {
  events: IntegrationEvent[];
}

function relativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const statusIcon: Record<IntegrationEvent['status'], JSX.Element> = {
  success: <CheckCircle className="h-4 w-4 text-green-500" />,
  failed: <XCircle className="h-4 w-4 text-red-500" />,
  pending: <Clock className="h-4 w-4 text-amber-500" />,
};

export default function EventsFeed({ events }: EventsFeedProps): JSX.Element {
  const [animatedIds, setAnimatedIds] = useState<Set<string>>(new Set());
  const prevIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentIds = new Set(events.map((e) => e.id));
    const newIds = new Set(
      [...currentIds].filter((id) => !prevIdsRef.current.has(id)),
    );

    if (newIds.size > 0) {
      setAnimatedIds(newIds);
      const timer = setTimeout(() => setAnimatedIds(new Set()), 600);
      prevIdsRef.current = currentIds;
      return () => clearTimeout(timer);
    }

    prevIdsRef.current = currentIds;
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No recent events</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>
        Recent Events
      </h3>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ul className="divide-y divide-white/5">
          {events.map((event) => (
            <li
              key={event.id}
              className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5 ${
                animatedIds.has(event.id) ? 'animate-slide-in-right' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {statusIcon[event.status]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    {event.type}
                  </span>
                  <span className="flex-shrink-0 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {relativeTime(event.timestamp)}
                  </span>
                </div>
                <p className="truncate text-sm" style={{ color: 'var(--text-muted)' }}>
                  {event.message}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}