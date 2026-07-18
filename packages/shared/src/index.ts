/**
 * @meridian/shared — Shared types and utilities
 * Re-exports all shared domain types for cross-package consumption.
 */

// ── Enums ──
export enum JobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL',
}

export enum SyncStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  RETRYING = 'RETRYING',
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  SAP_ADMIN = 'SAP_ADMIN',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  FINANCE_ANALYST = 'FINANCE_ANALYST',
  OPS_ENGINEER = 'OPS_ENGINEER',
  PLATFORM_ENGINEER = 'PLATFORM_ENGINEER',
  AUDITOR = 'AUDITOR',
  COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER',
  READ_ONLY = 'READ_ONLY',
}

export enum VarianceSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum VarianceStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED',
  ACCEPTED = 'ACCEPTED',
}

// ── Domain Types ──

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface RawSAPRecord {
  BUKRS: string;
  BELNR: string;
  GJAHR: string;
  BUDAT: string;
  WAERS: string;
  DMBTR: string;
  SHKZG: 'S' | 'H';
  MWSKZ?: string;
  WERKS?: string;
  KOSTL?: string;
  HKONT?: string;
}

export interface CanonicalFinancialRecord {
  transactionId: string;
  companyCode: string;
  fiscalYear: number;
  postingDate: string;
  localAmount: number;
  currency: string;
  glAccount: string;
  costCenter: string;
  plantId: string;
  taxCode?: string;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  dbCrIndicator: 'DEBIT' | 'CREDIT';
  correlationId: string;
  mappingVersion: string;
  transformedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  correlationId?: string;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ── Dashboard Types ──
export type {
  PipelineStatus,
  ServiceHealth,
  ConnectionStatus,
  IntegrationEvent,
  DashboardOverview,
  DashboardMetrics,
  MetricPoint,
} from './dashboard.js';

// ── Integration & DLQ Types ──
export type {
  IntegrationJobSummary,
  IntegrationJobListResponse,
  DeadLetterEntry,
  DeadLetterListResponse,
  TriggerExtractionPayload,
  TriggerExtractionResponse,
} from './integration.js';

export type { IntegrationJob, TriggerJobResponse } from './integrations.js';
export type { DLQMessage, DLQActionResponse } from './dlq.js';

// ── Shared Utilities ──
export function generateCorrelationId(): string {
  return `CID-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatISO(date: Date): string {
  return date.toISOString();
}
