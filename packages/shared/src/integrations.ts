/**
 * @meridian/shared — Integration Job types
 * Domain interfaces for integration job management.
 */

export interface IntegrationJob {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'failed' | 'success';
  source: string;
  destination: string;
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
}

export interface TriggerJobResponse {
  jobId: string;
  status: string;
}