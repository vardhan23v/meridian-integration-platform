/**
 * @meridian/shared — Integration Job & DLQ types
 * Shared interfaces for the Meridian Integration Platform job management.
 */

import type { JobStatus } from './index.js';

export interface IntegrationJobSummary {
  id: string;
  companyId: string;
  jobType: string;
  status: JobStatus;
  totalRecords: number;
  startedAt: string;
  completedAt: string | null;
}

export interface IntegrationJobListResponse {
  jobs: IntegrationJobSummary[];
  total: number;
}

export interface DeadLetterEntry {
  id: string;
  jobId: string;
  payload: Record<string, unknown>;
  errorCode: string;
  errorReason: string;
  retryCount: number;
  resolved: boolean;
  createdAt: string;
}

export interface DeadLetterListResponse {
  entries: DeadLetterEntry[];
  total: number;
}

export interface TriggerExtractionPayload {
  companyCode: string;
  fiscalYear: string;
}

export interface TriggerExtractionResponse {
  jobId: string;
}