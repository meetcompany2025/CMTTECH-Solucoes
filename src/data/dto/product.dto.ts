import { Product, ProductCreate, ProductUpdate } from '@/domain/entities/product.entity';

// API Response DTOs
export interface ProductResponseDTO {
    id: string;
    nome: string;
    sku: string;
    slug: string;
    descricao_curta: string | null;
    descricao_completa: string | null;
    preco_base: number;
    preco_venda: number;
    preco_promocional?: number | null;
    custo?: number | null;
    categoria_id: string;
    marca?: string | null;
    stock_quantidade: number;
    stock_reservado: number;
    peso?: number | null;
    dimensoes?: Record<string, number> | null;
    imagem_principal?: string | null;
    imagens_galeria?: string[];
    video_url?: string | null;
    tipo_produto: string;
    tem_variantes: boolean;
    activo: boolean;
    destaque: boolean;
    novidade: boolean;
    mais_vendido: boolean;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
    variantes?: any[];
    created_at: string;
    updated_at: string;
}

export interface ProductCreateDTO {
    categoria_id: string;
    nome: string;
    sku: string;
    slug: string;
    descricao_curta?: string | null;
    descricao_completa?: string | null;
    preco_base: number;
    preco_venda: number;
    custo?: number;
    tipo_produto: string;
    peso?: number;
    dimensoes?: Record<string, number>;
    imagem_principal?: string | null;
    imagens_galeria?: string[];
    video_url?: string | null;
    tem_variantes: boolean;
    activo?: boolean;
    destaque?: boolean;
    novidade?: boolean;
    mais_vendido?: boolean;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
    variantes?: any[];
}

export interface ProductUpdateDTO {
    categoria_id?: string;
    nome?: string;
    sku?: string;
    slug?: string;
    descricao_curta?: string | null;
    descricao_completa?: string | null;
    preco_base?: number;
    preco_venda?: number;
    custo?: number;
    tipo_produto?: string;
    peso?: number;
    dimensoes?: Record<string, number>;
    imagem_principal?: string | null;
    imagens_galeria?: string[];
    video_url?: string | null;
    tem_variantes?: boolean;
    activo?: boolean;
    destaque?: boolean;
    novidade?: boolean;
    mais_vendido?: boolean;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
    variantes?: any[];
}

// Mappers
export class ProductMapper {
    static toDomain(dto: ProductResponseDTO): Product {
        return {
            id: dto.id,
            nome: dto.nome,
            sku: dto.sku,
            slug: dto.slug,
            descricao_curta: dto.descricao_curta,
            descricao_completa: dto.descricao_completa,
            preco_base: dto.preco_base,
            preco_venda: dto.preco_venda,
            preco_promocional: dto.preco_promocional,
            custo: dto.custo,
            categoria_id: dto.categoria_id,
            marca: dto.marca,
            stock_quantidade: dto.stock_quantidade,
            stock_reservado: dto.stock_reservado,
            peso: dto.peso,
            dimensoes: dto.dimensoes as any,
            imagem_principal: dto.imagem_principal,
            imagens_galeria: dto.imagens_galeria || [],
            video_url: dto.video_url,
            tipo_produto: dto.tipo_produto,
            tem_variantes: dto.tem_variantes,
            ativo: dto.activo,
            destaque: dto.destaque,
            novidade: dto.novidade,
            mais_vendido: dto.mais_vendido,
            meta_title: dto.meta_title,
            meta_description: dto.meta_description,
            meta_keywords: dto.meta_keywords,
            variantes: dto.variantes as any,
            created_at: dto.created_at,
            updated_at: dto.updated_at,
        };
    }

    static toCreateDTO(data: ProductCreate): ProductCreateDTO {
        return {
            categoria_id: data.categoria_id,
            nome: data.nome,
            sku: data.sku,
            slug: data.slug,
            descricao_curta: data.descricao_curta,
            descricao_completa: data.descricao_completa,
            preco_base: data.preco_base,
            preco_venda: data.preco_venda,
            custo: data.custo,
            tipo_produto: data.tipo_produto,
            peso: data.peso,
            dimensoes: data.dimensoes,
            imagem_principal: data.imagem_principal,
            imagens_galeria: data.imagens_galeria,
            video_url: data.video_url,
            tem_variantes: data.tem_variantes,
            activo: data.activo ?? true,
            destaque: data.destaque ?? false,
            novidade: data.novidade ?? false,
            mais_vendido: data.mais_vendido ?? false,
            meta_title: data.meta_title,
            meta_description: data.meta_description,
            meta_keywords: data.meta_keywords,
            variantes: data.variantes as any,
        };
    }

    static toUpdateDTO(data: ProductUpdate): ProductUpdateDTO {
        return {
            categoria_id: data.categoria_id,
            nome: data.nome,
            sku: data.sku,
            slug: data.slug,
            descricao_curta: data.descricao_curta,
            descricao_completa: data.descricao_completa,
            preco_base: data.preco_base,
            preco_venda: data.preco_venda,
            custo: data.custo,
            tipo_produto: data.tipo_produto,
            peso: data.peso,
            dimensoes: data.dimensoes,
            imagem_principal: data.imagem_principal,
            imagens_galeria: data.imagens_galeria,
            video_url: data.video_url,
            tem_variantes: data.tem_variantes,
            activo: data.activo,
            destaque: data.destaque,
            novidade: data.novidade,
            mais_vendido: data.mais_vendido,
            meta_title: data.meta_title,
            meta_description: data.meta_description,
            meta_keywords: data.meta_keywords,
            variantes: data.variantes as any,
        };
    }
}
