---
title: docker-compose up -d --build api web successfully build
slug: docker-compose-up-d-build-api-web-successfully-build
tags: 
scope: project
updated_at: 2026-07-18T18:16:14.797Z
source: live
hook: docker-compose up -d --build api web successfully builds and starts all services including
---

- docker-compose up -d --build api web successfully builds and starts all services including postgres, redis, redpanda, api, and web.
- API endpoint /api/v1/dashboard/overview returns HTTP 200 with expected dashboard JSON structure.
- Dashboard page at /dashboard returns HTTP 200 and includes all expected component markers in rendered HTML.
- Containers use Dockerfiles located at docker/Dockerfile.api and docker/Dockerfile.web.
- Project uses Node.js 22 LTS for backend and Next.js 15 for frontend.
- Frontend components include StatCard, PipelineCard, ServiceHealthGrid, MetricsChart, EventsFeed, and related hooks/stores.
- Shared types defined in packages/shared/src/dashboard.ts and imported into both API and web apps.
- Middleware configured for web app at apps/web/src/middleware.ts.
- API and web apps have separate package.json files under apps/api and apps/web respectively.
- Web app uses global CSS for styling and includes smooth transitions and scroll behavior.
- Environment variables for API include DATABASE_URL, REDIS_URL, and KAFKA_BROKERS pointing to respective services.
- Port mappings configured: postgres on 5433, redis on 6379, redpanda on 9092/8082, api on 3000, web on 4000.
- Client-side data fetching in dashboard relies on NEXT_PUBLIC_API_URL set to http://localhost:3000/api/v1.
- Browser-based requests to the API from the dashboard page require the host's localhost:3000 to be accessible.
