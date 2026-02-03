import { httpClient } from '@/infrastructure/http/http-client';
import { AuditLogResponseDTO, AuditLogMapper } from '../dto/audit-log.dto';
import { AuditLog } from '@/domain/entities/audit-log.entity';

export class AuditLogDataSource {
    private readonly basePath = '/system/audit-logs';

    async getAll(params?: { skip?: number; limit?: number }): Promise<AuditLog[]> {
        const response = await httpClient.get<AuditLogResponseDTO[]>(this.basePath, {
            params: {
                skip: params?.skip || 0,
                limit: params?.limit || 50,
            },
        });
        return response.data.map(dto => AuditLogMapper.toDomain(dto));
    }
}
