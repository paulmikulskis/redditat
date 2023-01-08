import type { AuditLog as DbAuditLog } from "@prisma/client";

export { DbAuditLog };

export const STATE_STATUSES = {
  CREATED: "CREATED",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export interface AuditLog<M extends string = string> extends DbAuditLog {
  message: M;
  status: StateStatuses;
}

export type StateStatuses = keyof typeof STATE_STATUSES;

export function isPaymentStatus(status?: string): status is StateStatuses {
  return status != undefined && STATE_STATUSES[status as StateStatuses] !== undefined;
}

/* 400 error */
export class RequestError extends Error {}

/* 500 error */
export class ServerError extends Error {}
export class DbError extends ServerError {}
export class AuditLogDbError extends DbError {}

export interface Media {
  uri: string;
  type?: "jpeg" | "jpg" | "png" | "mp3" | "m4a" | "mp4" | "wav" | "bytes";
  sizeBytes?: number;
}

export type TaskStatus = "IN_PROGRESS" | "SUCCESS" | "ERROR" | "CREATED";
