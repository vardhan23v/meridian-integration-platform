# Meridian Integration Platform 🚀

[![CI Pipeline](https://github.com/meridian-mfg/integration-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/meridian-mfg/integration-platform/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Enterprise integration middleware connecting **SAP S/4HANA** (via ODP Delta Extractions) to **FinSight Financial Analytics**.

## 🏗️ Architecture

- **Backend**: Node.js 22 LTS, Express, TypeScript, Prisma ORM
- **Frontend**: Next.js 15, Tailwind CSS, shadcn/ui, Zustand
- **Event Streaming**: Kafka (Redpanda) for idempotent, exactly-once delivery
- **Database**: PostgreSQL 16
- **Caching**: Redis 7 for rate-limiting and session state
- **Observability**: Prometheus, Grafana, Winston JSON Logging

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 22 + pnpm
- Git

### 2. Setup
```bash
# Install dependencies
pnpm install

# Copy environment variables
cp apps/api/.env.example apps/api/.env
```

### 3. Run Services
```bash
# Start Postgres, Redis, and Redpanda (Kafka)
docker-compose up -d postgres redis redpanda

# Run Database Migrations and Seeding
pnpm db:migrate
pnpm db:seed

# Start API and Web Apps locally (with Hot Reload)
pnpm dev
```

- **Frontend Dashboard**: [http://localhost:4000](http://localhost:4000)
- **Swagger API Docs**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Prometheus Metrics**: [http://localhost:3000/api/v1/metrics](http://localhost:3000/api/v1/metrics)

---

## 🔒 Default Credentials
*Seeded automatically on `db:seed`*
- **Super Admin**: `admin@meridian.com` / `Meridian@2026`
- **Finance Manager**: `finance@meridian.com` / `Meridian@2026`
