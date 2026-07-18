import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type {
  DashboardOverview,
  DashboardMetrics,
  IntegrationEvent,
} from '@meridian/shared';
import { apiClient } from '@/lib/api-client';

// ── Query Key Factory ──

export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
  metrics: (range: string) => [...dashboardKeys.all, 'metrics', range] as const,
  events: (limit: number) => [...dashboardKeys.all, 'events', limit] as const,
};

// ── Defaults ──

const STALE_TIME = 10_000; // 10 seconds
const REFETCH_INTERVAL = 30_000; // 30 seconds

// ── Hooks ──

export function useDashboardOverview(): UseQueryResult<DashboardOverview> {
  return useQuery<DashboardOverview>({
    queryKey: dashboardKeys.overview(),
    queryFn: async () => {
      const response = await apiClient.get<DashboardOverview>('/dashboard/overview');
      return response.data;
    },
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
  });
}

export function useDashboardMetrics(range: string): UseQueryResult<DashboardMetrics> {
  return useQuery<DashboardMetrics>({
    queryKey: dashboardKeys.metrics(range),
    queryFn: async () => {
      const response = await apiClient.get<DashboardMetrics>(
        `/dashboard/metrics?range=${encodeURIComponent(range)}`,
      );
      return response.data;
    },
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
  });
}

export function useDashboardEvents(
  limit: number,
): UseQueryResult<{ events: IntegrationEvent[] }> {
  return useQuery<{ events: IntegrationEvent[] }>({
    queryKey: dashboardKeys.events(limit),
    queryFn: async () => {
      const response = await apiClient.get<IntegrationEvent[]>(
        `/dashboard/events?limit=${limit}`,
      );
      return { events: response.data };
    },
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
  });
}