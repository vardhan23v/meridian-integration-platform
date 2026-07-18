/**
 * @meridian/shared — DLQ types
 * Domain interfaces for dead-letter queue management.
 */

export interface DLQMessage {
  id: string;
  topic: string;
  partition: number;
  offset: string;
  payload: string;
  error: string;
  timestamp: string;
  status: 'pending' | 'retrying' | 'resolved' | 'dead';
  retryCount: number;
}

export interface DLQActionResponse {
  messageId: string;
  status: string;
}