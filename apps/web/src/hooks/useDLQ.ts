import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type { DLQMessage } from '@meridian/shared';
import { apiClient } from '@/lib/api-client';

// ── Query Key Factory ──

export const dlqKeys = {
  all: ['dlq'] as const,
  list: () => [...dlqKeys.all, 'list'] as const,
};

// ── Defaults ──

const STALE_TIME = 10_000;

// ── Hooks ──

export function useDLQMessages(): UseQueryResult<DLQMessage[], Error> {
  return useQuery<DLQMessage[], Error>({
    queryKey: dlqKeys.list(),
    queryFn: async () => {
      const response = await apiClient.get<DLQMessage[]>('/dlq');
      return response.data;
    },
    staleTime: STALE_TIME,
  });
}

export function useRetryMessage(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (messageId: string) => {
      await apiClient.post(`/dlq/${encodeURIComponent(messageId)}/retry`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dlqKeys.list() });
    },
  });
}

export function useResolveMessage(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (messageId: string) => {
      await apiClient.post(`/dlq/${encodeURIComponent(messageId)}/resolve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dlqKeys.list() });
    },
  });
}