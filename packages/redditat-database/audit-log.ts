import type { Result } from "ts-results";
import { Ok, Err } from "ts-results";
import type { PrismaClient } from "@prisma/client";

import type { AuditLog } from "./types";
import { AuditLogDbError } from "./types";

class AuditLogService {
  constructor(private db: PrismaClient) {}

  /* Create AuditLog from app interaction and insert into DB */
  async logInteraction(logRecord: Omit<AuditLog, "id" | "timestamp">): Promise<Result<AuditLog, AuditLogDbError>> {
    try {
      const record = await this.db.auditLog.create({
        data: logRecord,
      });
      return Ok(record as AuditLog);
    } catch (e) {
      console.error(e);
      return Err(new AuditLogDbError(`Audit log creation unsuccessful: ${e}`));
    }
  }
}

export { AuditLogService };
