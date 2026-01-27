import { Category, CategoryCreate, CategoryUpdate } from '@/domain/entities/category.entity';

// API Response DTOs
export interface CategoryResponseDTO {
    id: string;
    nome: string;
    descr?: string | null;
    descricao?: string | null;
    slug: string;
    imagem?: string | null;
    parent_id?: string | null;
    ordem: number;
    activo: boolean;
    created_at: string;
    updated_at: string;
}

export interface CategoryCreateDTO {
    nome: string;
    descricao?: string | null;
    slug?: string;
    imagem?: string | null;
    parent_id?: string | null;
    ordem?: number;
    activo?: boolean;
}

export interface CategoryUpdateDTO {
    nome?: string;
    descricao?: string | null;
    slug?: string;
    imagem?: string | null;
    parent_id?: string | null;
    ordem?: number;
    activo?: boolean;
}

// Mappers
export class CategoryMapper {
    static toDomain(dto: CategoryResponseDTO): Category {
        return {
            id: dto.id,
            nome: dto.nome,
            descricao: dto.descricao || dto.descr,
            slug: dto.slug,
            icone: dto.imagem,
            ordem: dto.ordem,
            ativo: dto.activo,
            created_at: dto.created_at,
            updated_at: dto.updated_at,
        };
    }

    static toCreateDTO(data: CategoryCreate): CategoryCreateDTO {
        return {
            nome: data.nome,
            descricao: data.descricao,
            slug: data.slug || this.generateSlug(data.nome),
            imagem: data.icone,
            ordem: data.ordem ?? 0,
            activo: data.ativo ?? true,
        };
    }

    static toUpdateDTO(data: CategoryUpdate): CategoryUpdateDTO {
        return {
            nome: data.nome,
            descricao: data.descricao,
            slug: data.slug,
            imagem: data.icone,
            ordem: data.ordem,
            activo: data.ativo,
        };
    }

    private static generateSlug(nome: string): string {
        return nome
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
}
