export interface Category {
    id: string;
    nome: string;
    descricao?: string | null;
    slug: string;
    icone?: string | null;
    ordem: number;
    ativo: boolean;
    created_at: string;
    updated_at: string;
}

export interface CategoryCreate {
    nome: string;
    descricao?: string | null;
    slug?: string;
    icone?: string | null;
    ordem?: number;
    ativo?: boolean;
}

export interface CategoryUpdate {
    nome?: string;
    descricao?: string | null;
    slug?: string;
    icone?: string | null;
    ordem?: number;
    ativo?: boolean;
}
