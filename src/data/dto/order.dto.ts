import { Order, OrderItem, Address, OrderStatus, PaymentStatus } from '@/domain/entities/order.entity';

// API Response DTOs based on swagger.json
export interface OrderItemDTO {
    id: string;
    produto_id: string;
    sku: string;
    nome: string;
    quantidade: number;
    preco_unitario: number;
    subtotal: number;
}

export interface CustomerDTO {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

// TODO: Define AddressDTO based on swagger if available, but for now assuming it's part of OrderResponse or fetched separately
// In swagger, address is an ID `endereco_entrega_id`. Usually get order includes address details or we fetch separately.
// Swagger `OrderResponse` does NOT show embedded address details, only `endereco_entrega_id`.
// However, the previous DTO had `morada_entrega`. Checking swagger again...
// Swagger says `endereco_entrega_id`. It doesn't seem to embed the address object.
// We might need to handle this. For now let's leave address as optional/partial in domain or unknown.

export interface OrderResponseDTO {
    id: string;
    numero_encomenda: string;
    cliente_id: string;
    cliente?: CustomerDTO | null;
    endereco_entrega_id?: string | null;
    estado: string; // Swagger says 'estado' is string, likely matches OrderStatus
    estado_pagamento: string; // Swagger says 'estado_pagamento'
    subtotal_produtos: number;
    desconto_cupom: number;
    taxa_entrega: number;
    impostos: number;
    total: number;
    itens: OrderItemDTO[];
    created_at?: string | null;
    updated_at?: string | null;
    notas_cliente?: string | null;
}

export interface OrderStatusUpdateDTO {
    estado?: string;
    estado_pagamento?: string;
}

// Mappers
export class OrderMapper {
    static toDomain(dto: OrderResponseDTO): Order {
        return {
            id: dto.id,
            numero_pedido: dto.numero_encomenda,
            customer_id: dto.cliente_id,
            customer_nome: dto.cliente ? `${dto.cliente.first_name} ${dto.cliente.last_name}` : undefined,
            customer_email: dto.cliente?.email,
            customer_telefone: dto.cliente?.phone_number,
            status: this.mapStatus(dto.estado),
            status_pagamento: this.mapPaymentStatus(dto.estado_pagamento),
            metodo_pagamento: "Standard", // Not in swagger response?
            subtotal: dto.subtotal_produtos || 0,
            desconto: dto.desconto_cupom || 0,
            taxa_entrega: dto.taxa_entrega || 0,
            imposto: dto.impostos || 0,
            total: dto.total || 0,
            items: dto.itens ? dto.itens.map(item => this.mapOrderItem(item)) : [],
            morada_entrega: {
                rua: "", // Placeholder as address is via ID
                cidade: "",
                provincia: "",
                pais: ""
            },
            notas: dto.notas_cliente,
            created_at: dto.created_at || new Date().toISOString(),
            updated_at: dto.updated_at || new Date().toISOString(),
        };
    }

    private static mapStatus(status: string): OrderStatus {
        // Map API status string to Domain Status
        const s = status?.toLowerCase();
        if (s === 'pendente') return 'pendente';
        if (s === 'processamento') return 'em_processamento';
        if (s === 'enviado') return 'enviado';
        if (s === 'entregue') return 'entregue';
        if (s === 'cancelado') return 'cancelado';
        return 'pendente';
    }

    private static mapPaymentStatus(status: string): PaymentStatus {
        const s = status?.toLowerCase();
        if (s === 'pendente') return 'pendente';
        if (s === 'pago') return 'pago';
        if (s === 'falhou') return 'falhado';
        if (s === 'reembolsado') return 'reembolsado';
        return 'pendente';
    }

    private static mapOrderItem(dto: OrderItemDTO): OrderItem {
        return {
            id: dto.id,
            produto_id: dto.produto_id,
            produto_nome: dto.nome,
            quantidade: dto.quantidade || 0,
            preco_unitario: dto.preco_unitario || 0,
            subtotal: dto.subtotal || 0,
        };
    }
}
