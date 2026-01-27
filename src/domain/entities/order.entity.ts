export type OrderStatus =
    | 'pendente'
    | 'confirmado'
    | 'em_processamento'
    | 'enviado'
    | 'entregue'
    | 'cancelado';

export type PaymentStatus =
    | 'pendente'
    | 'pago'
    | 'falhado'
    | 'reembolsado';

export interface Address {
    rua: string;
    cidade: string;
    provincia: string;
    codigo_postal?: string;
    pais: string;
}

export interface OrderItem {
    id: string;
    produto_id: string;
    sku?: string;
    produto_nome: string;
    quantidade: number;
    preco_unitario: number;
    subtotal: number;
}

export interface Order {
    id: string;
    numero_pedido: string;
    customer_id: string;
    customer_nome?: string;
    customer_email?: string;
    customer_telefone?: string;
    status: OrderStatus;
    metodo_pagamento: string;
    status_pagamento: PaymentStatus;
    subtotal: number;
    desconto: number;
    taxa_entrega: number;
    imposto: number;
    total: number;
    items: OrderItem[];
    morada_entrega: Address;
    notas?: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderStatusUpdate {
    status?: OrderStatus;
    status_pagamento?: PaymentStatus;
}

export interface OrderSearchParams {
    status?: OrderStatus;
    status_pagamento?: PaymentStatus;
    metodo_pagamento?: string;
    data_inicio?: string;
    data_fim?: string;
    skip?: number;
    limit?: number;
}
