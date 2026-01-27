export interface StockAlert {
    id: string;
    product_id: string;
    variant_id?: string | null;
    stock_critico: number;
    stock_optimo: number;
    alertado: boolean;
    ultima_alertacao?: string | null;
    ativo: boolean;
    created_at: string;
    updated_at?: string | null;
    // Optional expanded info if API provides it, otherwise we might need to fetch product details separately
    produto_nome?: string;
    variante_nome?: string | null;
    stock_atual?: number;
    abaixo_critico?: boolean;
}

export interface StockAlertCreate {
    product_id: string;
    variant_id?: string | null;
    stock_critico: number;
    stock_optimo: number;
    ativo?: boolean;
}

export interface StockAlertUpdate {
    stock_critico?: number;
    stock_optimo?: number;
    ativo?: boolean;
}

export interface StockAlertSearchParams {
    apenas_ativos?: boolean;
    apenas_alertados?: boolean;
    skip?: number;
    limit?: number;
}
