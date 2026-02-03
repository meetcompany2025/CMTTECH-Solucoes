/**
 * User Entity - Domain model for user
 */

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar_url?: string | null;
    preferences?: Record<string, any> | null;
    interests?: Record<string, any> | null;
    cliente?: Cliente | null;
}

export interface Cliente {
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
    enderecos: Endereco[];
}

export interface Endereco {
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

export interface UserCreate {
    username: string;
    email: string;
    password: string;
    avatar_url?: string | null;
    role?: string;
    preferences?: Record<string, any> | null;
    interests?: Record<string, any> | null;
}

export interface UserUpdate {
    username?: string | null;
    email?: string | null;
    password?: string | null;
    role?: string | null;
    preferences?: Record<string, any> | null;
    interests?: Record<string, any> | null;
}
