import { DeliveryMethod, DeliveryMethodCreate, DeliveryMethodUpdate } from '@/domain/entities/delivery-method.entity';

export interface DeliveryMethodResponseDTO {
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

export interface DeliveryMethodCreateDTO {
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

export interface DeliveryMethodUpdateDTO {
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

export class DeliveryMethodMapper {
    static toDomain(dto: DeliveryMethodResponseDTO): DeliveryMethod {
        return {
            id: dto.id,
            nome: dto.nome,
            descricao: dto.descricao,
            tipo: dto.tipo,
            custo: dto.custo,
            custo_extra_kg: dto.custo_extra_kg,
            tempo_estimado_dias: dto.tempo_estimado_dias,
            provincias_disponiveis: dto.provincias_disponiveis,
            peso_maximo: dto.peso_maximo,
            activo: dto.activo,
            created_at: dto.created_at,
            updated_at: dto.updated_at,
        };
    }

    static toCreateDTO(data: DeliveryMethodCreate): DeliveryMethodCreateDTO {
        return {
            nome: data.nome,
            descricao: data.descricao,
            tipo: data.tipo,
            custo: data.custo,
            custo_extra_kg: data.custo_extra_kg,
            tempo_estimado_dias: data.tempo_estimado_dias,
            provincias_disponiveis: data.provincias_disponiveis,
            peso_maximo: data.peso_maximo,
            activo: data.activo,
        };
    }

    static toUpdateDTO(data: DeliveryMethodUpdate): DeliveryMethodUpdateDTO {
        return {
            nome: data.nome,
            descricao: data.descricao,
            tipo: data.tipo,
            custo: data.custo,
            custo_extra_kg: data.custo_extra_kg,
            tempo_estimado_dias: data.tempo_estimado_dias,
            provincias_disponiveis: data.provincias_disponiveis,
            peso_maximo: data.peso_maximo,
            activo: data.activo,
        };
    }
}
