import AuditLogService from "./audit-log";

import { db } from "./db.server";
export * from "@prisma/client";
export * from "./db.server";
export * from "./audit-log";

export const auditLogService = new AuditLogService(db);
