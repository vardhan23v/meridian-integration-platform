---
title: Created `packages/shared/src/integrations.ts` with `Int
slug: created-packages-shared-src-integrations-ts-with-int
tags: 
scope: project
updated_at: 2026-07-18T19:36:37.058Z
source: live
hook: Created `packages/shared/src/integrations.ts` with `IntegrationJob` and `TriggerJobRespons
---

• Created `packages/shared/src/integrations.ts` with `IntegrationJob` and `TriggerJobResponse` interfaces  
• Created `packages/shared/src/dlq.ts` with `DLQMessage` and `DLQActionResponse` interfaces  
• Updated `packages/shared/src/index.ts` to re-export all shared types from `integrations.ts` and `dlq.ts`  
• Verified successful build and typecheck with `pnpm --filter @meridian/shared build` and `typecheck`  
• Shared types are now importable by both API and web applications via `@meridian/shared`
