/**
 * Global TypeScript type definitions for the Meridian Integration Platform.
 */

// ── SAP Raw Record (as received from ODP extraction) ──
export interface RawSAPRecord {
  BUKRS: string;    // Company Code (e.g., '1000')
  BELNR: string;    // Document Number
  GJAHR: string;    // Fiscal Year
  BUZEI?: string;   // Line Item Number
  BLART?: string;   // Document Type
  BUDAT: string;    // Posting Date (YYYYMMDD)
  WAERS: string;    // Currency Code
  DMBTR: string;    // Amount in Local Currency
  WRBTR?: string;   // Amount in Document Currency
  SHKZG: string;    // Debit/Credit Indicator (S=Debit, H=Credit)
  HKONT?: string;   // GL Account Number
  KOSTL?: string;   // Cost Center
  PRCTR?: string;   // Profit Center
  LIFNR?: string;   // Vendor Number
  KUNNR?: string;   // Customer Number
  MWSKZ?: string;   // Tax Code
  WERKS?: string;   // Plant Code
  MATNR?: string;   // Material Number
  KOART?: string;   // Account Type (D=Customer, K=Vendor, S=GL)
}

// ── Canonical Financial Record (CDM Output) ──
export interface CanonicalFinancialRecord {
  transactionId: string;
  companyCode: string;
  fiscalYear: number;
  fiscalPeriod?: number;
  documentType?: string;
  postingDate: string;       // ISO 8601
  localAmount: number;
  documentAmount?: number;
  currency: string;
  glAccount?: string;
  costCenter?: string;
  profitCenter?: string;
  vendorId?: string;
  customerId?: string;
  plantId?: string;
  materialId?: string;
  taxCode?: string;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  accountType?: string;
  dbCrIndicator: 'DEBIT' | 'CREDIT';
  correlationId: string;
  mappingVersion: string;
  transformedAt: string;
}

// ── API Response Envelope ──
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

// ── JWT Payload ──
export interface JwtPayload {
  sub: string;      // User ID
  email: string;
  role: string;
  plantCodes?: string[];  // ABAC: Allowed plant codes
  iat?: number;
  exp?: number;
}

// ── Integration Job ──
export interface IntegrationJobDTO {
  id: string;
  companyCode: string;
  jobType: 'FULL' | 'DELTA';
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PARTIAL';
  totalExtracted: number;
  totalLoaded: number;
  totalFailed: number;
  startedAt: string;
  completedAt?: string;
}

// ── Reconciliation Variance ──
export interface VarianceDTO {
  id: string;
  reconciliationJobId: string;
  ruleId: string;
  varianceType: 'COUNT' | 'AMOUNT' | 'FIELD';
  sapValue: string;
  finsightValue: string;
  difference: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'RESOLVED' | 'ACCEPTED';
  resolvedBy?: string;
  resolvedAt?: string;
}
