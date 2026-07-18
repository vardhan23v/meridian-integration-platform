/**
 * @meridian/shared — Dashboard types
 * Shared interfaces for the Meridian Integration Platform dashboard.
 */

export interface PipelineStatus {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error';
  lastRun: string;
  throughput: number;
}

export interface ServiceHealth {
  name: string;
  status: 'up' | 'down' | 'degraded';
  latency: number;
  uptime: string;
}

export interface ConnectionStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastConnected: string;
  message?: string;
}

export interface IntegrationEvent {
  id: string;
  type: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  timestamp: string;
}

export interface DashboardOverview {
  pipelines: PipelineStatus[];
  services: ServiceHealth[];
  events: IntegrationEvent[];
  stats: {
    totalPipelines: number;
    activePipelines: number;
    totalEvents: number;
    failedEvents: number;
  };
}

export interface DashboardMetrics {
  pipelineThroughput: MetricPoint[];
  serviceLatency: MetricPoint[];
  eventVolume: MetricPoint[];
}

export interface MetricPoint {
  timestamp: string;
  value: number;
}