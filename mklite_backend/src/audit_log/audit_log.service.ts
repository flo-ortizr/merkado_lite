import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { AuditLog } from 'src/audit_log/audit_log.entity';

@Injectable()
export class AuditLogService {
    async createLog(log: AuditLog){
        return await AppDataSource.manager.save(AuditLog, log);
    }

    async getAllLogs() {
        return await AppDataSource.manager.find(AuditLog);
    }

    async getLogById(id: number) {
        return await AppDataSource.manager.findOneBy(AuditLog, {id_log: id});
    }

    async DeleteLog(id: number) {
        return await AppDataSource.manager.delete(AuditLog, {id_audit_log: id});
    }

    async UpdateLog(id: number, log: AuditLog) {
        return await AppDataSource.manager.update(AuditLog, {id_audit_log: id}, log);
    } 
}