# Meridian Integration Platform 🚀

[![CI Pipeline](https://github.com/meridian-mfg/integration-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/meridian-mfg/integration-platform/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Enterprise integration middleware connecting **SAP S/4HANA** (via ODP Delta Extractions) to **FinSight Financial Analytics**. Provides a real-time dashboard for monitoring integration pipelines, managing dead-letter queues, and running financial reconciliations.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Monorepo Structure](#-monorepo-structure)
- [Frontend Architecture](#-frontend-architecture)
- [Dashboard Features](#-dashboard-features)
- [API Routes](#-api-routes)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Local Development](#-local-development)
- [Deployment](#-deployment)
- [Default Login Credentials](#-default-login-credentials)

---

## 🔭 Project Overview

Meridian Integration Platform is an enterprise-grade middleware that bridges SAP S/4HANA with FinSight Financial Analytics. It handles:

- **ODP Delta Extractions** from SAP S/4HANA (FI-GL, CO-PA, MM, SD modules)
- **Canonical transformation** of SAP records into FinSight-compatible financial documents
- **Idempotent, exactly-once delivery** via Redpanda (Kafka-compatible) event streaming
- **Real-time monitoring** through a Next.js dashboard with live metrics, pipeline status, and service health
- **Dead Letter Queue (DLQ)** management for failed messages with retry and resolve capabilities
- **Financial reconciliation** to detect variances between SAP source data and FinSight target records

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Node.js | 22 LTS |
| **Package Manager** | pnpm | ≥9.0.0 |
| **Backend Framework** | Express | 4.x |
| **Frontend Framework** | Next.js (App Router) | 15 |
| **Language** | TypeScript | 5.6+ |
| **ORM** | Prisma | 6.x |
| **Database** | PostgreSQL | 16 (Alpine) |
| **Cache** | Redis | 7 (Alpine) |
| **Event Streaming** | Redpanda (Kafka API) | 23.1 |
| **CSS Framework** | Tailwind CSS | 4.x |
| **UI Components** | shadcn/ui | — |
| **State Management** | Zustand | 5.x |
| **Data Fetching** | TanStack Query | 5.x |
| **Charts** | Recharts | 2.x |
| **Validation** | Zod | 3.x |
| **Forms** | React Hook Form | 7.x |
| **Auth** | JWT (jsonwebtoken + bcryptjs) | — |
| **Observability** | Winston, prom-client, Swagger | — |
| **CI/CD** | GitHub Actions | — |

---

## 📁 Monorepo Structure

```
pro2/
├── apps/
│   ├── api/                          # @meridian/api — Express backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Database schema
│   │   │   └── seed.ts               # Seed script (users, companies, plants)
│   │   └── src/
│   │       ├── app.ts                # Express app setup & middleware
│   │       ├── server.ts             # Entry point
│   │       ├── config/env.ts         # Zod-validated env config
│   │       ├── auth/                 # JWT auth & RBAC middleware
│   │       ├── controllers/          # Route handlers
│   │       ├── services/             # Business logic
│   │       ├── repositories/         # Data access layer
│   │       ├── routes/               # Express routers
│   │       ├── middlewares/          # Correlation ID, logging, rate limiting
│   │       ├── integrations/         # SAP connector
│   │       ├── monitoring/           # Prometheus metrics
│   │       └── docs/                 # Swagger/OpenAPI setup
│   │
│   └── web/                          # @meridian/web — Next.js frontend
│       ├── vercel.json               # Vercel monorepo deployment config
│       └── src/
│           ├── app/
│           │   ├── layout.tsx        # Root layout (fonts, providers)
│           │   ├── page.tsx          # Landing page
│           │   ├── globals.css       # Tailwind + custom glass styles
│           │   ├── (auth)/           # Route group: login page
│           │   └── (dashboard)/      # Route group: authenticated dashboard
│           │       ├── layout.tsx    # Sidebar + header + auth guard
│           │       └── dashboard/
│           │           ├── page.tsx           # Main dashboard
│           │           ├── jobs/              # Integration jobs page
│           │           ├── dlq/               # Dead Letter Queue page
│           │           └── reconciliation/    # Reconciliation page
│           ├── components/
│           │   ├── providers.tsx     # TanStack Query + Zustand providers
│           │   ├── dashboard/        # StatCard, PipelineStatusList, MetricsChart, etc.
│           │   ├── jobs/             # IntegrationJobsTable
│           │   └── dlq/              # DLQTable
│           ├── hooks/
│           │   └── useDashboard.ts   # TanStack Query hooks for dashboard data
│           ├── stores/
│           │   └── auth.store.ts     # Zustand auth store (persisted)
│           └── lib/
│               └── api-client.ts     # Axios client with JWT interceptor
│
├── packages/
│   └── shared/                       # @meridian/shared — shared types & utilities
│       └── src/
│           ├── index.ts              # Re-exports all types, enums, and utilities
│           ├── dashboard.ts          # Dashboard-specific types
│           ├── integration.ts        # Integration job types
│           ├── integrations.ts       # Trigger job types
│           └── dlq.ts                # Dead Letter Queue types
│
├── docker/
│   ├── Dockerfile.api                # Multi-stage API build
│   └── Dockerfile.web                # Multi-stage Web build
│
├── docker-compose.yml                # Local dev services (postgres, redis, redpanda, api, web)
├── pnpm-workspace.yaml               # pnpm workspace definition
├── package.json                      # Root scripts (dev, build, db:migrate, db:seed)
└── .github/workflows/ci.yml          # CI pipeline
```

---

## 🎨 Frontend Architecture

### App Router & Route Groups

The frontend uses **Next.js 15 App Router** with route groups for clean separation:

- **`(auth)/`** — Unauthenticated routes (login page). No sidebar or auth guard.
- **`(dashboard)/`** — Authenticated routes. Wrapped in a shared layout with:
  - **Glass-morphism sidebar** with navigation links (Dashboard, Integration Jobs, DLQ, Reconciliation)
  - **Frosted-glass header** showing the logged-in user and sign-out button
  - **Auth guard** via Zustand `useAuthStore` — redirects to `/login` if no user

### Styling

- **Tailwind CSS 4** with custom CSS variables for glass-morphism effects (`glass-surface`, `glass-elevated`, `glass-strong`)
- **shadcn/ui** component primitives (buttons, inputs, cards)
- **Lucide React** for icons
- Responsive grid layouts with animated background orbs

### State Management & Data Fetching

| Concern | Library | Details |
|---------|---------|---------|
| Auth state | Zustand | Persisted to `localStorage`; stores user + JWT token |
| Server state | TanStack Query | `useDashboardOverview`, `useDashboardMetrics`, `useDashboardEvents` with 10s stale time and 30s auto-refetch |
| API client | Axios | Base URL from `NEXT_PUBLIC_API_URL`; auto-injects JWT `Authorization` header; handles 401 → logout redirect |
| Forms | React Hook Form + Zod | Validation schemas for login and other forms |

---

## 📊 Dashboard Features

### Metrics Cards
Four stat cards at the top of the dashboard: **Total Pipelines**, **Active Pipelines**, **Total Events**, and **Failed Events**. Each card has a distinct accent color (indigo, emerald, amber, rose) with hover glow effects.

### Pipeline Status
Lists all integration pipelines (SAP FI-GL, CO-PA, MM, SD → FinSight) with real-time status indicators:
- 🟢 **Healthy** — pipeline running normally
- 🟡 **Warning** — degraded performance or delayed sync
- 🔴 **Error** — pipeline has failed

Each pipeline card shows the pipeline name, status badge, last run timestamp, and throughput (records/minute).

### Service Health Grid
Displays the health of all infrastructure services:
- API Gateway, PostgreSQL, Redis, Redpanda (Kafka), SAP ODP Connector
- Each service shows status (up/degraded/down), latency in ms, and uptime

### Charts (Recharts)
Two chart types powered by Recharts with time-range selection (`1h`, `6h`, `24h`, `7d`):
- **Pipeline Throughput** — area chart showing records processed over time
- **Service Latency** — bar chart showing API response times

### Events Feed
Real-time event stream showing the latest integration events:
- Sync completions, warnings, and failures
- Connection restorations
- Reconciliation runs
- Color-coded by status (success/pending/failed)

### Integration Jobs
Tabular view of all integration jobs with columns: Job ID, Company, Type (BATCH/DELTA), Status, Record Count, Started At, Completed At. Supports filtering and status-based styling.

### Dead Letter Queue (DLQ)
Table of failed messages that could not be delivered to FinSight. Each entry shows:
- Error code and reason
- Retry count
- Resolution status
- **Actions**: Retry (reprocess the message) or Resolve (mark as handled)

### Reconciliation
Interface to trigger and view financial reconciliations between SAP source data and FinSight target records, with variance detection by severity (CRITICAL, HIGH, MEDIUM, LOW).

---

## 🔌 API Routes

All routes are prefixed with `/api/v1` (except dashboard which is also mounted at `/api/dashboard` for convenience).

### Authentication

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| `POST` | `/api/v1/auth/login` | No | — | Login with email/password, returns JWT |
| `GET` | `/api/v1/auth/me` | Yes | Any | Get current user profile |

### Dashboard

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/dashboard/overview` | Yes | Pipeline statuses, service health, recent events, stats |
| `GET` | `/api/v1/dashboard/metrics?range=1h\|6h\|24h\|7d` | Yes | Time-series data for throughput, latency, event volume |
| `GET` | `/api/v1/dashboard/events?limit=10` | Yes | Recent integration events |

### Integration Jobs

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| `GET` | `/api/v1/integrations` | Yes | Any | List all integration jobs |
| `POST` | `/api/v1/integrations/extract` | Yes | SUPER_ADMIN, SAP_ADMIN, PLATFORM_ENGINEER | Trigger SAP ODP extraction |

### Dead Letter Queue

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/dlq` | Yes | List all DLQ entries |
| `POST` | `/api/v1/dlq/:id/retry` | Yes | Retry a failed message |
| `POST` | `/api/v1/dlq/:id/resolve` | Yes | Mark a DLQ entry as resolved |

### Reconciliation

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/reconciliations/start` | Yes | Start a reconciliation run |
| `GET` | `/api/v1/reconciliations/:id/variances` | Yes | Get variances for a reconciliation |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/metrics` | Prometheus metrics endpoint |
| `GET` | `/api-docs` | Swagger UI |
| `GET` | `/health/liveness` | Kubernetes liveness probe |

### API Response Format

All API responses follow a consistent envelope:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Dashboard overview retrieved",
  "data": { ... },
  "timestamp": "2026-07-18T22:00:00.000Z"
}
```

---

## 🗄️ Database Schema

The database is managed by **Prisma ORM** with PostgreSQL 16. The schema is defined in `apps/api/prisma/schema.prisma`.

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | Platform users with role-based access (10 roles: SUPER_ADMIN through READ_ONLY) |
| `companies` | SAP company codes (BUKRS) with country |
| `plants` | SAP plants (WERKS) belonging to companies |
| `integration_jobs` | Batch and delta extraction jobs with status tracking |
| `audit_entries` | Per-record sync audit trail (SAP doc → FinSight ID mapping) |
| `dead_letter_queue` | Failed messages with payload, error details, retry count, and resolution status |
| `general_ledgers` | Cached financial postings for reconciliation (amount, tax breakdowns, currency) |

### Key Enums

- **JobStatus**: `PENDING`, `RUNNING`, `COMPLETED`, `FAILED`, `PARTIAL`
- **SyncStatus**: `SUCCESS`, `ERROR`, `RETRYING`
- **Role**: `SUPER_ADMIN`, `SYSTEM_ADMIN`, `SAP_ADMIN`, `FINANCE_MANAGER`, `FINANCE_ANALYST`, `OPS_ENGINEER`, `PLATFORM_ENGINEER`, `AUDITOR`, `COMPLIANCE_OFFICER`, `READ_ONLY`

### Seeding

The seed script (`apps/api/prisma/seed.ts`) creates:

1. **Company**: Meridian Manufacturing - Maharashtra (code `1000`) with two plants (Pune HQ `1001`, Nashik `1002`)
2. **Users**:
   - `admin@meridian.com` — SUPER_ADMIN
   - `finance@meridian.com` — FINANCE_MANAGER

All seeded users share the default password (see [Default Login Credentials](#-default-login-credentials)).

---

## 🔐 Environment Variables

### Backend (`apps/api/.env`)

Copy `apps/api/.env.example` to `apps/api/.env` and configure:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | `development` | `development`, `production`, or `test` |
| `PORT` | Yes | `3000` | API server port |
| `LOG_LEVEL` | Yes | `info` | Winston log level (`debug`, `info`, `warn`, `error`) |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string |
| `REDIS_URL` | Yes | `redis://localhost:6379` | Redis connection string |
| `KAFKA_BROKERS` | Yes | `localhost:9092` | Redpanda/Kafka broker addresses |
| `KAFKA_CLIENT_ID` | Yes | `meridian-integration-platform` | Kafka consumer group ID |
| `JWT_SECRET` | **Yes** | — | Secret key for JWT signing (min 32 chars) |
| `JWT_ACCESS_EXPIRY` | Yes | `15m` | Access token TTL |
| `JWT_REFRESH_EXPIRY` | Yes | `8h` | Refresh token TTL |
| `SAP_HOST` | Yes | `10.0.0.50` | SAP application server host |
| `SAP_SYSNR` | Yes | `00` | SAP system number |
| `SAP_CLIENT` | Yes | `100` | SAP client/mandant |
| `SAP_USER` | Yes | `MERIDIAN_INT` | SAP RFC user |
| `SAP_MAX_RFC_CONNECTIONS` | Yes | `50` | Max parallel RFC connections |
| `FINSIGHT_API_URL` | Yes | `http://localhost:3000/api/v1/mock/finsight` | FinSight API endpoint |
| `FINSIGHT_API_KEY` | Yes | `finsight-dev-api-key` | FinSight API key |
| `RATE_LIMIT_WINDOW_MS` | Yes | `60000` | Rate limit window in ms |
| `RATE_LIMIT_MAX_REQUESTS` | Yes | `100` | Max requests per window |
| `CORS_ORIGIN` | Yes | `http://localhost:4000` | Allowed CORS origin |

### Frontend (`apps/web/.env.local`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:3000/api/v1` | Backend API base URL |

---

## 💻 Local Development

### Prerequisites

- **Docker & Docker Compose** — for PostgreSQL, Redis, and Redpanda
- **Node.js 22 LTS**
- **pnpm ≥9.0.0** — install via `corepack enable && corepack prepare pnpm@latest --activate`

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
# Backend
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env if needed (defaults work with docker-compose)

# Frontend (optional — defaults to localhost:3000)
# Create apps/web/.env.local if you need to override NEXT_PUBLIC_API_URL
```

### 3. Start Infrastructure Services

```bash
docker-compose up -d postgres redis redpanda
```

This starts:
- **PostgreSQL 16** on port `5433` (mapped to avoid conflicts with local Postgres)
- **Redis 7** on port `6379`
- **Redpanda** (Kafka API) on port `9092`

### 4. Build Shared Package

```bash
pnpm --filter @meridian/shared build
```

### 5. Run Database Migrations & Seed

```bash
pnpm db:migrate
pnpm db:seed
```

### 6. Start Development Servers

```bash
# Start both API and Web with hot reload
pnpm dev

# Or start individually:
pnpm dev:api   # API on http://localhost:3000
pnpm dev:web   # Web on http://localhost:4000
```

### 7. Access the Application

| Service | URL |
|---------|-----|
| **Dashboard** | [http://localhost:4000](http://localhost:4000) |
| **API** | [http://localhost:3000](http://localhost:3000) |
| **Swagger Docs** | [http://localhost:3000/api-docs](http://localhost:3000/api-docs) |
| **Prometheus Metrics** | [http://localhost:3000/api/v1/metrics](http://localhost:3000/api/v1/metrics) |
| **Health Check** | [http://localhost:3000/health/liveness](http://localhost:3000/health/liveness) |

### Useful Commands

```bash
pnpm build          # Build all packages (shared → api → web)
pnpm lint           # Lint all packages
pnpm typecheck      # Type-check all packages
pnpm db:generate    # Regenerate Prisma client
pnpm db:studio      # Open Prisma Studio (DB GUI)
pnpm clean          # Remove all build artifacts
```

---

## 🚀 Deployment

### Vercel (Frontend)

The `apps/web` directory is configured for deployment to Vercel as part of a pnpm monorepo.

**`apps/web/vercel.json`:**

```json
{
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "buildCommand": "cd ../.. && pnpm --filter @meridian/shared build && pnpm --filter @meridian/web build",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**Root `package.json`** includes the required `packageManager` field:

```json
"packageManager": "pnpm@11.13.0"
```

**Vercel project settings:**
- **Framework**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: (auto-detected from `vercel.json`)
- **Install Command**: (auto-detected from `vercel.json`)
- **Output Directory**: (auto-detected from `vercel.json`)

The `installCommand` navigates to the monorepo root so pnpm can resolve workspace dependencies (`@meridian/shared`). The `buildCommand` builds the shared package first, then the web app.

### Docker (Full Stack)

Multi-stage Dockerfiles are provided in `docker/`:

```bash
# Build and start all services
docker-compose up -d

# Build individual services
docker build -f docker/Dockerfile.api -t meridian-api .
docker build -f docker/Dockerfile.web -t meridian-web .
```

The `docker-compose.yml` defines five services: `postgres`, `redis`, `redpanda`, `api` (port 3000), and `web` (port 4000).

### CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push:
- Install dependencies
- Build shared package
- Type-check and lint all packages
- Build API and Web

---

## 🔒 Default Login Credentials

These users are created automatically when you run `pnpm db:seed`:

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `admin@meridian.com` | `Meridian@2026` |
| **Finance Manager** | `finance@meridian.com` | `Meridian@2026` |

> ⚠️ **Change these credentials immediately in production.** The seed script uses `upsert`, so re-running it will not overwrite existing users.

---

## 📄 License

MIT © Meridian Manufacturing Ltd.