export interface DeliveryMethod {
    id: string;
    nome: string;
    descricao?: string | null;
    tipo: string;
    custo: number;
    custo_extra_kg: number;
    tempo_estimado_dias: number;
    provincias_disponiveis?: string[] | null;
    peso_maximo?: number | null;
    activo: boolean;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface DeliveryMethodCreate {
    nome: string;
    descricao?: string | null;
    tipo?: string;
    custo?: number;
    custo_extra_kg?: number;
    tempo_estimado_dias?: number;
    provincias_disponiveis?: string[] | null;
    peso_maximo?: number | null;
    activo?: boolean;
}

export interface DeliveryMethodUpdate {
    nome?: string | null;
    descricao?: string | null;
    tipo?: string | null;
    custo?: number | null;
    custo_extra_kg?: number | null;
    tempo_estimado_dias?: number | null;
    provincias_disponiveis?: string[] | null;
    peso_maximo?: number | null;
    activo?: boolean | null;
}
