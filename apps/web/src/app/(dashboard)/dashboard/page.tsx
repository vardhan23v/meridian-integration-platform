'use client';

import { Suspense, type JSX } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Zap,
} from 'lucide-react';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import StatCard from '@/components/dashboard/StatCard';
import PipelineStatusList from '@/components/dashboard/PipelineStatusList';
import ServiceHealthGrid from '@/components/dashboard/ServiceHealthGrid';
import MetricsChart from '@/components/dashboard/MetricsChart';
import EventsFeed from '@/components/dashboard/EventsFeed';
import {
  useDashboardOverview,
  useDashboardMetrics,
  useDashboardEvents,
} from '@/hooks/useDashboard';

function DashboardData(): JSX.Element {
  const { data: overview } = useDashboardOverview();
  const { data: metrics } = useDashboardMetrics('1h');
  const { data: eventsData } = useDashboardEvents(10);

  const stats = overview?.stats;
  const pipelines = overview?.pipelines ?? [];
  const services = overview?.services ?? [];
  const events = eventsData?.events ?? [];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <section className="animate-fade-in-up delay-100">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="animate-fade-in-up delay-100 group relative">
            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="glass-surface h-full w-full rounded-2xl p-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
              <StatCard
                title="Total Pipelines"
                value={stats?.totalPipelines ?? 0}
                icon={BarChart3}
                accent="indigo"
              />
            </div>
          </div>
          <div className="animate-fade-in-up delay-200 group relative">
            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="glass-surface h-full w-full rounded-2xl p-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10">
              <StatCard
                title="Active Pipelines"
                value={stats?.activePipelines ?? 0}
                icon={CheckCircle}
                accent="emerald"
              />
            </div>
          </div>
          <div className="animate-fade-in-up delay-300 group relative">
            <div className="absolute inset-0 bg-amber-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="glass-surface h-full w-full rounded-2xl p-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10">
              <StatCard
                title="Total Events"
                value={stats?.totalEvents ?? 0}
                icon={Zap}
                accent="amber"
              />
            </div>
          </div>
          <div className="animate-fade-in-up delay-400 group relative">
            <div className="absolute inset-0 bg-rose-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="glass-surface h-full w-full rounded-2xl p-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/10">
              <StatCard
                title="Failed Events"
                value={stats?.failedEvents ?? 0}
                icon={AlertTriangle}
                accent="rose"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline Status */}
      <section className="glass-strong rounded-3xl p-6 shadow-xl animate-fade-in-up delay-200 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10">
          <PipelineStatusList pipelines={pipelines} />
        </div>
      </section>

      {/* Service Health */}
      <section className="glass-strong rounded-3xl p-6 shadow-xl animate-fade-in-up delay-300 relative overflow-hidden">
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="relative z-10">
          <ServiceHealthGrid services={services} />
        </div>
      </section>

      {/* Bottom Analytics Panels */}
      <section className="animate-fade-in-up delay-400">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" style={{ minHeight: '320px' }}>
          <div className="glass-strong flex flex-col gap-5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />
            <div className="relative z-10 space-y-5">
              <MetricsChart
                data={metrics?.pipelineThroughput ?? []}
                type="area"
                title="Pipeline Throughput"
              />
              <MetricsChart
                data={metrics?.serviceLatency ?? []}
                type="bar"
                title="Service Latency"
              />
            </div>
          </div>
          <div className="glass-strong rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="relative z-10 h-full">
              <EventsFeed events={events} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Integration Dashboard
        </h2>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  );
}