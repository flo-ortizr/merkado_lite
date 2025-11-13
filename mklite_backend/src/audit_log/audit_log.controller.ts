import { Controller, Get, Post, Delete, Put, Param } from "@nestjs/common";
import { AuditLog } from "src/audit_log/audit_log.entity";
import { AuditLogService } from "./audit_log.service";

@Controller('/AuditLog')
export class AuditLogController {
    constructor(private readonly auditLogService: AuditLogService) {}

    @Post()
    createLog(log : AuditLog) {
        this.auditLogService.createLog(log);
    }   

    @Get()
    getAllLogs(){
        return this.auditLogService.getAllLogs();
    }

    @Get('/:id')
    getLogById(@Param() params : any){
        return this.auditLogService.getLogById(params.id);
    }

    @Delete('/:id')
    deleteLog(@Param() params : any){
        return this.auditLogService.DeleteLog(params.id);
    }

    @Put('/:id')
    updateLog(@Param() params : any, log : AuditLog){
        return this.auditLogService.UpdateLog(params.id, log);
    }
}