import { Coupon, CouponCreate, CouponUpdate } from '@/domain/entities/coupon.entity';

export interface CouponResponseDTO {
    id: string;
    codigo: string;
    tipo: string;
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

export interface CouponCreateDTO {
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

export interface CouponUpdateDTO {
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

export class CouponMapper {
    static toDomain(dto: CouponResponseDTO): Coupon {
        return {
            id: dto.id,
            codigo: dto.codigo,
            tipo: dto.tipo,
            valor: dto.valor,
            valor_minimo_compra: dto.valor_minimo_compra,
            limite_uso_total: dto.limite_uso_total,
            limite_uso_cliente: dto.limite_uso_cliente,
            categorias_aplicaveis: dto.categorias_aplicaveis,
            produtos_aplicaveis: dto.produtos_aplicaveis,
            data_inicio: dto.data_inicio,
            data_fim: dto.data_fim,
            activo: dto.activo,
            usos_actuais: dto.usos_actuais,
            created_at: dto.created_at,
        };
    }

    static toCreateDTO(data: CouponCreate): CouponCreateDTO {
        return {
            codigo: data.codigo,
            tipo: data.tipo,
            valor: data.valor,
            valor_minimo_compra: data.valor_minimo_compra,
            limite_uso_total: data.limite_uso_total,
            limite_uso_cliente: data.limite_uso_cliente,
            categorias_aplicaveis: data.categorias_aplicaveis,
            produtos_aplicaveis: data.produtos_aplicaveis,
            data_inicio: data.data_inicio,
            data_fim: data.data_fim,
            activo: data.activo,
        };
    }

    static toUpdateDTO(data: CouponUpdate): CouponUpdateDTO {
        return {
            codigo: data.codigo,
            tipo: data.tipo,
            valor: data.valor,
            valor_minimo_compra: data.valor_minimo_compra,
            limite_uso_total: data.limite_uso_total,
            limite_uso_cliente: data.limite_uso_cliente,
            categorias_aplicaveis: data.categorias_aplicaveis,
            produtos_aplicaveis: data.produtos_aplicaveis,
            data_inicio: data.data_inicio,
            data_fim: data.data_fim,
            activo: data.activo,
        };
    }
}
