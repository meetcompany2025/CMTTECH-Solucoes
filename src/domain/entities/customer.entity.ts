export interface CustomerAddress {
    id?: string;
    tipo: string; // 'entrega' | 'fatura'
    nome_destinatario?: string | null;
    telefone?: string | null;
    provincia: string;
    municipio: string;
    bairro?: string | null;
    rua?: string | null;
    numero_casa?: string | null;
    ponto_referencia?: string | null;
}

export interface Customer {
    id: string;
    nome: string;
    email: string;
    telefone?: string | null;
    nif?: string | null;
    data_nascimento?: string | null;
    genero?: string | null;
    newsletter_aceite: boolean;
    notas_internas?: string | null;
    total_compras: number;
    total_gasto: number;
    ultimo_pedido_at?: string | null;
    created_at: string;
    updated_at: string;
    enderecos: CustomerAddress[];
}

export interface CustomerSearchParams {
    skip?: number;
    limit?: number;
    buscar?: string; // Search by name/email
}
