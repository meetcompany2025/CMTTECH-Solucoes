export interface Coupon {
    id: string;
    codigo: string;
    tipo: string; // 'percentagem' | 'valor_fixo'
    valor: number;
    valor_minimo_compra?: number | null;
    limite_uso_total?: number | null;
    limite_uso_cliente: number;
    categorias_aplicaveis?: string[] | null;
    produtos_aplicaveis?: string[] | null;
    data_inicio?: string | null;
    data_fim?: string | null;
    activo: boolean;
    usos_actuais: number;
    created_at?: string | null;
}

export interface CouponCreate {
    codigo: string;
    tipo?: string;
    valor: number;
    valor_minimo_compra?: number | null;
    limite_uso_total?: number | null;
    limite_uso_cliente?: number;
    categorias_aplicaveis?: string[] | null;
    produtos_aplicaveis?: string[] | null;
    data_inicio?: string | null;
    data_fim?: string | null;
    activo?: boolean;
}

export interface CouponUpdate {
    codigo?: string | null;
    tipo?: string | null;
    valor?: number | null;
    valor_minimo_compra?: number | null;
    limite_uso_total?: number | null;
    limite_uso_cliente?: number | null;
    categorias_aplicaveis?: string[] | null;
    produtos_aplicaveis?: string[] | null;
    data_inicio?: string | null;
    data_fim?: string | null;
    activo?: boolean | null;
}
