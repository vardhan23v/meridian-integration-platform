/**
 * Application-level constants used across the platform.
 * Centralizes magic strings and numbers for maintainability.
 */

// ── SAP Tables ──
export const SAP_TABLES = {
  ACDOCA: 'ACDOCA',
  BKPF: 'BKPF',
  BSEG: 'BSEG',
  LFA1: 'LFA1',
  KNA1: 'KNA1',
  CSKS: 'CSKS',
  CEPC: 'CEPC',
  EKKO: 'EKKO',
  EKPO: 'EKPO',
  VBAK: 'VBAK',
  VBAP: 'VBAP',
} as const;

// ── Kafka Topics ──
export const KAFKA_TOPICS = {
  SAP_RAW: 'sap.raw',
  SAP_TRANSFORMED: 'sap.transformed',
  FINSIGHT_READY: 'finsight.ready',
  DLQ: 'integration.dlq',
  AUDIT: 'integration.audit',
} as const;

// ── Meridian Company Codes (7 Plants) ──
export const MERIDIAN_PLANTS = {
  '1000': { name: 'Meridian Mfg — Pune HQ', state: 'MH', region: 'Maharashtra' },
  '1001': { name: 'Meridian Mfg — Nashik', state: 'MH', region: 'Maharashtra' },
  '1002': { name: 'Meridian Mfg — Aurangabad', state: 'MH', region: 'Maharashtra' },
  '1003': { name: 'Meridian Mfg — Ahmedabad', state: 'GJ', region: 'Gujarat' },
  '1004': { name: 'Meridian Mfg — Vadodara', state: 'GJ', region: 'Gujarat' },
  '1005': { name: 'Meridian Mfg — Chennai', state: 'TN', region: 'Tamil Nadu' },
  '1006': { name: 'Meridian Mfg — Coimbatore', state: 'TN', region: 'Tamil Nadu' },
} as const;

// ── HTTP Status Codes ──
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ── User Roles (RBAC) ──
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  SAP_ADMIN: 'SAP_ADMIN',
  FINANCE_MANAGER: 'FINANCE_MANAGER',
  FINANCE_ANALYST: 'FINANCE_ANALYST',
  OPS_ENGINEER: 'OPS_ENGINEER',
  PLATFORM_ENGINEER: 'PLATFORM_ENGINEER',
  AUDITOR: 'AUDITOR',
  COMPLIANCE_OFFICER: 'COMPLIANCE_OFFICER',
  READ_ONLY: 'READ_ONLY',
} as const;

// ── Job Types ──
export const JOB_TYPES = {
  FULL: 'FULL',
  DELTA: 'DELTA',
} as const;

// ── Financial Precision ──
export const FINANCIAL_PRECISION = 4; // DECIMAL(23,4)
export const ZERO_DECIMAL_CURRENCIES = ['JPY', 'KRW', 'IDR', 'VND'] as const;
