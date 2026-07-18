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
    <div className="space-y-5">
      {/* Stat Cards */}
      <section className="glass bg-white/10 backdrop-blur border-white/10 p-4 animate-fade-in-up delay-100">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="animate-fade-in-up delay-100">
            <StatCard
              title="Total Pipelines"
              value={stats?.totalPipelines ?? 0}
              icon={BarChart3}
              accent="indigo"
            />
          </div>
          <div className="animate-fade-in-up delay-200">
            <StatCard
              title="Active Pipelines"
              value={stats?.activePipelines ?? 0}
              icon={CheckCircle}
              accent="emerald"
            />
          </div>
          <div className="animate-fade-in-up delay-300">
            <StatCard
              title="Total Events"
              value={stats?.totalEvents ?? 0}
              icon={Zap}
              accent="amber"
            />
          </div>
          <div className="animate-fade-in-up delay-400">
            <StatCard
              title="Failed Events"
              value={stats?.failedEvents ?? 0}
              icon={AlertTriangle}
              accent="rose"
            />
          </div>
        </div>
      </section>

      {/* Pipeline Status */}
      <section className="glass bg-white/10 backdrop-blur border-white/10 p-4 animate-fade-in-up delay-200">
        <PipelineStatusList pipelines={pipelines} />
      </section>

      {/* Service Health */}
      <section className="glass bg-white/10 backdrop-blur border-white/10 p-4 animate-fade-in-up delay-300">
        <ServiceHealthGrid services={services} />
      </section>

      {/* Bottom Analytics Panels */}
      <section className="glass bg-white/10 backdrop-blur border-white/10 p-5 animate-fade-in-up delay-400">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2" style={{ minHeight: '320px' }}>
          <div className="flex flex-col gap-5">
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
          <EventsFeed events={events} />
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