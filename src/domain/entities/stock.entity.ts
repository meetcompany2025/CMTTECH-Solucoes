export interface StockLevel {
    id: string;
    produto_id: string;
    variante_id?: string | null;
    quantidade: number;
    reservado: number;
    disponivel: number;
    produto_nome?: string;
    variante_nome?: string;
    status: 'ok' | 'baixo' | 'critico';
}

export interface StockMovement {
    id: string;
    produto_id: string;
    variante_id?: string | null;
    tipo: 'entrada' | 'saida' | 'ajuste' | 'reserva' | 'devolucao';
    quantidade: number;
    saldo_anterior: number;
    saldo_novo: number;
    motivo: string;
    notas?: string | null;
    origem_id?: string | null;
    created_at: string;
    produto_nome?: string;
    variante_nome?: string;
}

export interface StockAdjustmentRequest {
    produto_id: string;
    variante_id?: string | null;
    quantidade_nova: number;
    motivo: string;
    notas?: string | null;
}

export interface StockSummary {
    total_produtos: number;
    total_variantes: number;
    status_counts: {
        ok: number;
        baixo: number;
        critico: number;
    };
    valor_total_inventario: number;
}
