---
title: Created `apps/web/src/hooks/useDashboard.ts` with TanSt
slug: created-apps-web-src-hooks-usedashboard-ts-with-tanst
tags: 
scope: project
updated_at: 2026-07-18T20:07:23.281Z
source: live
hook: Created `apps/web/src/hooks/useDashboard.ts` with TanStack Query hooks: `useDashboardOverv
---

• Created `apps/web/src/hooks/useDashboard.ts` with TanStack Query hooks: `useDashboardOverview`, `useDashboardMetrics`, and `useDashboardEvents`, each with `staleTime: 10000` and `refetchInterval: 30000`.
• Implemented query keys using a `dashboardKeys` factory for cache management.
• Created `apps/web/src/stores/dashboardStore.ts` with Zustand for global state: `timeRange` and `autoRefresh`, along with setter and toggler functions.
• Configured hooks to fetch data from `/dashboard/overview`, `/dashboard/metrics`, and `/dashboard/events` endpoints respectively.
• Ensured type safety with `DashboardOverview`, `DashboardMetrics`, and `IntegrationEvent` interfaces from `packages/shared`.
• Verified TypeScript compilation passes without errors for both new files.
• Created `apps/web/src/hooks/useIntegrationJobs.ts` with `useIntegrationJobs()` query hook and `useTriggerJob()` mutation hook
• Created `apps/web/src/hooks/useDLQ.ts` with `useDLQMessages()`, `useRetryMessage()`, and `useResolveMessage()` hooks
• Both hook files use `apiClient` from `@/lib/api-client` and follow same patterns as existing `useDashboard.ts`
• Query hooks set 10-second stale time for cached data
• Mutation hooks invalidate related queries on successful completion
• All hooks use correct TypeScript return types per interface contract
• TypeScript compilation completes without errors
