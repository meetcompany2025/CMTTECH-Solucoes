export interface ProductVariant {
    id?: string;
    sku: string;
    nome_variante: string;
    opcoes: Record<string, any>;
    preco_ajuste: number;
    stock_actual: number;
    stock_minimo: number;
    imagem?: string | null;
    activo: boolean;
}

export interface Product {
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
    dimensoes?: {
        additionalProp1?: number;
        additionalProp2?: number;
        additionalProp3?: number;
    } | null;
    imagem_principal?: string | null;
    imagens_galeria?: string[];
    video_url?: string | null;
    tipo_produto: string; // 'simples' or 'variavel'
    tem_variantes: boolean;
    ativo: boolean;
    destaque: boolean;
    novidade: boolean;
    mais_vendido: boolean;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
    variantes?: ProductVariant[];
    created_at: string;
    updated_at: string;
}

export interface ProductCreate {
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
    variantes?: ProductVariant[];
    // Backward compatibility or internal fields
    marca?: string | null;
    stock_quantidade?: number;
}

export interface ProductUpdate {
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
    variantes?: ProductVariant[];
    // Backward compatibility
    marca?: string | null;
    stock_quantidade?: number;
}

export interface ProductSearchParams {
    nome?: string;
    categoria_id?: string;
    preco_min?: number;
    preco_max?: number;
    em_stock?: boolean;
    ativo?: boolean;
    destaque?: boolean;
    skip?: number;
    limit?: number;
    sort_by?: string;
    order?: 'asc' | 'desc';
}
