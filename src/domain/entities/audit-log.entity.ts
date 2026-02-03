export interface AuditLog {
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
