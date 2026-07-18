---
title: Project decisions
slug: project-decisions
tags: 
scope: project
updated_at: 2026-07-18T18:01:46.824Z
source: live
hook: User-stated constraints, newest: if no such configured node exists, or if configured to false, all node
---

- [2026-07-18] If no such configured node exists, or if configured to false, all nodes denoted by the seed_servers list must be identical among those nodes' configurations, and those nodes will form the initial cluster
• Project uses Node.js 22 LTS for backend (API) and Next.js 15 for frontend (Web)
• Backend built with Express, TypeScript, Prisma ORM, KafkaJS, ioredis, Winston, prom-client, swagger
• Frontend built with Next.js 15, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, Recharts
• Docker images use multi-stage builds (base → builder → runner) for both API and Web services
• API service ports exposed at 3000, Web service at 4000
• Database is PostgreSQL 16, caching with Redis 7, event streaming via Kafka (Redpanda)
• Development uses `pnpm dev` for hot reload in both API and Web services
• Services defined in `docker-compose.yml`: postgres, redis, redpanda, api, web
• Shared package used across API and Web (`@meridian/shared`)
• CI pipeline uses GitHub Actions with badge in README
• Default credentials for seeded admin users provided in README
• No committed build artifacts in repository
• All packages build successfully with zero errors
• Web frontend uses Next.js 15 App Router with route groups `(auth)/` and `(dashboard)/`
• Dashboard layout includes sidebar, header, and auth guard using Zustand store
• API backend uses Express with manual dependency injection and role-based access control
• New dashboard API routes must be mounted under `/api/v1/` in `routes/index.ts`
• API routes require authentication and specific roles (`SUPER_ADMIN`, `SAP_ADMIN`, `PLATFORM_ENGINEER`)
• Frontend communicates with API via `apiClient` from `@/lib/api-client` pointing to `http://localhost:3000/api/v1`
• UI styling uses Tailwind CSS without shadcn/ui components
• Authentication middleware implemented via `requireAuth` and `requireRoles` in API routes
- Created `packages/shared/src/dashboard.ts` with interfaces: `PipelineStatus`, `ServiceHealth`, `ConnectionStatus`, `IntegrationEvent`, `DashboardOverview`, `DashboardMetrics`, and `MetricPoint`.
- Updated `packages/shared/src/index.ts` to re-export all types from `dashboard.ts`.
- Executed `pnpm --filter @meridian/shared build` successfully, generating corresponding JS and DTS files in `packages/shared/dist/`.
- Verified correct output files (`dashboard.d.ts`, `dashboard.js`) are present in the build directory.
