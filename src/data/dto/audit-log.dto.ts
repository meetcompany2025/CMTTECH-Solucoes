import { AuditLog } from '@/domain/entities/audit-log.entity';

export interface AuditLogResponseDTO {
    id: string;
    acao: string;
    entidade: string;
    entidade_id?: string | null;
    dados_anteriores?: Record<string, unknown> | null;
    dados_novos?: Record<string, unknown> | null;
    ip_address?: string | null;
    user_agent?: string | null;
    utilizador_id?: string | null;
    created_at?: string | null;
}

export class AuditLogMapper {
    static toDomain(dto: AuditLogResponseDTO): AuditLog {
        return {
            id: dto.id,
            acao: dto.acao,
            entidade: dto.entidade,
            entidade_id: dto.entidade_id,
            dados_anteriores: dto.dados_anteriores,
            dados_novos: dto.dados_novos,
            ip_address: dto.ip_address,
            user_agent: dto.user_agent,
            utilizador_id: dto.utilizador_id,
            created_at: dto.created_at,
        };
    }
}
