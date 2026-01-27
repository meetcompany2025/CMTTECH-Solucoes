import { StockAlert, StockAlertCreate, StockAlertUpdate } from '@/domain/entities/stock-alert.entity';

export interface StockAlertResponseDTO {
    id: string;
    produto_id: string;
    variante_id?: string | null;
    stock_critico: number;
    stock_optimo: number;
    alertado: boolean;
    ultima_alertacao?: string | null;
    ativo: boolean;
    created_at: string;
    updated_at?: string | null;
    produto_nome?: string;
    variante_nome?: string | null;
    stock_atual?: number;
    abaixo_critico?: boolean;
}

export interface StockAlertCreateDTO {
    produto_id: string;
    variante_id?: string | null;
    stock_critico: number;
    stock_optimo: number;
    ativo?: boolean;
}

export interface StockAlertUpdateDTO {
    stock_critico?: number | null;
    stock_optimo?: number | null;
    ativo?: boolean | null;
}

export class StockAlertMapper {
    static toDomain(dto: StockAlertResponseDTO): StockAlert {
        return {
            id: dto.id,
            product_id: dto.produto_id,
            variant_id: dto.variante_id,
            stock_critico: dto.stock_critico,
            stock_optimo: dto.stock_optimo,
            alertado: dto.alertado,
            ultima_alertacao: dto.ultima_alertacao,
            ativo: dto.ativo,
            created_at: dto.created_at,
            updated_at: dto.updated_at || dto.created_at,
            produto_nome: dto.produto_nome,
            variante_nome: dto.variante_nome || undefined,
            stock_atual: dto.stock_atual,
            abaixo_critico: dto.abaixo_critico,
        };
    }

    static toCreateDTO(data: StockAlertCreate): StockAlertCreateDTO {
        return {
            produto_id: data.product_id,
            variante_id: data.variant_id,
            stock_critico: data.stock_critico,
            stock_optimo: data.stock_optimo,
            ativo: data.ativo,
        };
    }

    static toUpdateDTO(data: StockAlertUpdate): StockAlertUpdateDTO {
        return {
            stock_critico: data.stock_critico,
            stock_optimo: data.stock_optimo,
            ativo: data.ativo,
        };
    }
}
