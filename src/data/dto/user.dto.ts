/**
 * User DTOs - Data Transfer Objects for API communication
 */

import { User, UserCreate, UserUpdate, Cliente, Endereco } from '@/domain/entities/user.entity';

export interface EnderecoDTO {
    id: string;
    tipo: "entrega" | "faturacao";
    nome_destinatario: string;
    telefone: string;
    provincia: string;
    municipio: string;
    bairro: string;
    rua: string;
    numero_casa: string;
    ponto_referencia?: string;
    codigo_postal: string;
    predefinido: boolean;
    created_at: string;
}

export interface ClienteDTO {
    id: string;
    nome: string;
    email: string;
    telefone?: string | null;
    nif?: string | null;
    data_nascimento?: string | null;
    genero?: string | null;
    newsletter_aceite: boolean;
    total_compras: number;
    total_gasto: number;
    ultimo_pedido_at?: string | null;
    created_at: string;
    updated_at: string;
    enderecos: EnderecoDTO[];
}

export interface UserResponseDTO {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar_url?: string | null;
    preferences?: Record<string, any> | null;
    interests?: Record<string, any> | null;
    cliente?: ClienteDTO | null;
}

export interface UserCreateDTO {
    username: string;
    email: string;
    password: string;
    avatar_url?: string | null;
    role?: string;
    preferences?: Record<string, any> | null;
    interests?: Record<string, any> | null;
}

export interface UserUpdateDTO {
    username?: string | null;
    email?: string | null;
    password?: string | null;
    role?: string | null;
    preferences?: Record<string, any> | null;
    interests?: Record<string, any> | null;
}

/**
 * Mapper: DTO to Domain Entity
 */
export function toUser(dto: UserResponseDTO): User {
    return {
        id: dto.id,
        username: dto.username,
        email: dto.email,
        role: dto.role,
        avatar_url: dto.avatar_url,
        preferences: dto.preferences,
        interests: dto.interests,
        cliente: dto.cliente ? toCliente(dto.cliente) : null,
    };
}

/**
 * Mapper: Cliente DTO to Domain Entity
 */
function toCliente(dto: ClienteDTO): Cliente {
    return {
        id: dto.id,
        nome: dto.nome,
        email: dto.email,
        telefone: dto.telefone,
        nif: dto.nif,
        data_nascimento: dto.data_nascimento,
        genero: dto.genero,
        newsletter_aceite: dto.newsletter_aceite,
        total_compras: dto.total_compras,
        total_gasto: dto.total_gasto,
        ultimo_pedido_at: dto.ultimo_pedido_at,
        created_at: dto.created_at,
        updated_at: dto.updated_at,
        enderecos: dto.enderecos.map(toEndereco),
    };
}

/**
 * Mapper: Endereco DTO to Domain Entity
 */
function toEndereco(dto: EnderecoDTO): Endereco {
    return {
        id: dto.id,
        tipo: dto.tipo,
        nome_destinatario: dto.nome_destinatario,
        telefone: dto.telefone,
        provincia: dto.provincia,
        municipio: dto.municipio,
        bairro: dto.bairro,
        rua: dto.rua,
        numero_casa: dto.numero_casa,
        ponto_referencia: dto.ponto_referencia,
        codigo_postal: dto.codigo_postal,
        predefinido: dto.predefinido,
        created_at: dto.created_at,
    };
}

/**
 * Mapper: Domain Entity to Create DTO
 */
export function toUserCreateDTO(data: UserCreate): UserCreateDTO {
    return {
        username: data.username,
        email: data.email,
        password: data.password,
        avatar_url: data.avatar_url,
        role: data.role,
        preferences: data.preferences,
        interests: data.interests,
    };
}

/**
 * Mapper: Domain Entity to Update DTO
 */
export function toUserUpdateDTO(data: UserUpdate): UserUpdateDTO {
    return {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        preferences: data.preferences,
        interests: data.interests,
    };
}
