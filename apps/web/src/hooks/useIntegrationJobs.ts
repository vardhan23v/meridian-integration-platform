import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type { IntegrationJob } from '@meridian/shared';
import { apiClient } from '@/lib/api-client';

// ── Query Key Factory ──

export const integrationJobKeys = {
  all: ['integration-jobs'] as const,
  list: () => [...integrationJobKeys.all, 'list'] as const,
};

// ── Defaults ──

const STALE_TIME = 10_000;

// ── Hooks ──

export function useIntegrationJobs(): UseQueryResult<IntegrationJob[], Error> {
  return useQuery<IntegrationJob[], Error>({
    queryKey: integrationJobKeys.list(),
    queryFn: async () => {
      const response = await apiClient.get<IntegrationJob[]>('/integrations');
      return response.data;
    },
    staleTime: STALE_TIME,
  });
}

export function useTriggerJob(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (jobName: string) => {
      await apiClient.post('/integrations/trigger', { name: jobName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationJobKeys.list() });
    },
  });
}