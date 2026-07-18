import { create } from 'zustand';

export interface DashboardStore {
  timeRange: string;
  autoRefresh: boolean;
  setTimeRange: (range: string) => void;
  toggleAutoRefresh: () => void;
}

export const useDashboardStore = create<DashboardStore>()((set) => ({
  timeRange: '1h',
  autoRefresh: true,
  setTimeRange: (range) => set({ timeRange: range }),
  toggleAutoRefresh: () => set((state) => ({ autoRefresh: !state.autoRefresh })),
}));