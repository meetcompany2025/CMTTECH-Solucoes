import { StockLevel, StockMovement, StockAdjustmentRequest, StockSummary } from '../../domain/entities/stock.entity';

export interface StockLevelResponseDTO {
    id: string;
    produto_id: string;
    variante_id?: string | null;
    quantidade: number;
    reservado: number;
    disponivel: number;
    produto_nome?: string;
    variante_nome?: string;
    status: string;
}

export interface StockMovementResponseDTO {
    id: string;
    produto_id: string;
    variante_id?: string | null;
    tipo_movimento: string;
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

export interface StockSummaryResponseDTO {
    total_produtos: number;
    total_variantes: number;
    status_counts: {
        ok: number;
        baixo: number;
        critico: number;
    };
    valor_total_inventario: number;
}

export class StockMapper {
    static toLevel(dto: StockLevelResponseDTO): StockLevel {
        return {
            id: dto.id,
            produto_id: dto.produto_id,
            variante_id: dto.variante_id,
            quantidade: dto.quantidade,
            reservado: dto.reservado,
            disponivel: dto.disponivel,
            produto_nome: dto.produto_nome,
            variante_nome: dto.variante_nome,
            status: dto.status as any
        };
    }

    static toMovement(dto: StockMovementResponseDTO): StockMovement {
        return {
            id: dto.id,
            produto_id: dto.produto_id,
            variante_id: dto.variante_id,
            tipo: dto.tipo_movimento as any,
            quantidade: dto.quantidade,
            saldo_anterior: dto.saldo_anterior,
            saldo_novo: dto.saldo_novo,
            motivo: dto.motivo,
            notas: dto.notas,
            origem_id: dto.origem_id,
            created_at: dto.created_at,
            produto_nome: dto.produto_nome,
            variante_nome: dto.variante_nome
        };
    }

    static toSummary(dto: StockSummaryResponseDTO): StockSummary {
        return {
            total_produtos: dto.total_produtos,
            total_variantes: dto.total_variantes,
            status_counts: dto.status_counts,
            valor_total_inventario: dto.valor_total_inventario
        };
    }

    static toAdjustmentRequest(request: StockAdjustmentRequest): any {
        return {
            produto_id: request.produto_id,
            variante_id: request.variante_id,
            quantidade_nova: request.quantidade_nova,
            motivo: request.motivo,
            notas: request.notas
        };
    }
}
