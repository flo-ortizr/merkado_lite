import { Module } from "@nestjs/common";
import { AuditLogController } from "./audit_log.controller";
import { AuditLogService } from "./audit_log.service";

@Module({
    imports: [],
    controllers: [AuditLogController],
    providers: [AuditLogService],
})
export class AuditLogModule {}