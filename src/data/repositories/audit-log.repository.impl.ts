import { AuditLogDataSource } from '../datasources/audit-log.datasource';
import { AuditLog } from '@/domain/entities/audit-log.entity';

export interface IAuditLogRepository {
    getAll(params?: { skip?: number; limit?: number }): Promise<AuditLog[]>;
}

export class AuditLogRepository implements IAuditLogRepository {
    private dataSource: AuditLogDataSource;

    constructor() {
        this.dataSource = new AuditLogDataSource();
    }

    async getAll(params?: { skip?: number; limit?: number }): Promise<AuditLog[]> {
        return this.dataSource.getAll(params);
    }
}
