import type { JSX } from 'react';

export default function DashboardSkeleton(): JSX.Element {
  return (
    <div className="space-y-8">
      {/* Stat cards skeleton */}
      <div className="glass bg-white/10 backdrop-blur border-white/10 p-6 animate-fade-in-up">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="glass-subtle bg-white/5 backdrop-blur border-white/10 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 animate-pulse rounded-xl bg-white/10" />
                  </div>
                  <div className="ml-4 w-0 flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                    <div className="h-6 w-1/2 animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="glass bg-white/10 backdrop-blur border-white/10 p-6 animate-fade-in-up delay-300">
        <div className="mb-4 h-6 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="glass-subtle bg-white/5 backdrop-blur border-white/10 flex h-64 items-center justify-center">
          <div className="h-8 w-1/2 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}
