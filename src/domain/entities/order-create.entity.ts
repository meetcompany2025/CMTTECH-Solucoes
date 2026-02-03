export interface OrderCreate {
    cliente_id: string;
    endereco_entrega_id?: string | null;
    endereco_faturacao_id?: string | null;
    metodo_entrega_id?: string | null;
    cupom_codigo?: string | null;
    notas_cliente?: string | null;
    itens: {
        produto_id: string;
        variante_id?: string | null;
        quantidade: number;
    }[];
}