export interface DashboardStats {
    total_receita: number;
    total_pedidos: number;
    ticket_medio: number;
    crescimento_receita: number; // Percentage
    crescimento_pedidos: number; // Percentage
}

export interface DailySales {
    data: string;
    total: number;
    quantidade: number;
}

export interface TopProduct {
    produto_id: string;
    nome: string;
    quantidade_vendida: number;
    total_faturado: number;
    imagem?: string | null;
}

export interface OrderStatusStats {
    estado: string;
    quantidade: number;
    percentagem: number;
}

export interface AnalyticsDashboard {
    stats: DashboardStats;
    vendas_diarias: DailySales[];
    produtos_top: TopProduct[];
    estados_encomendas: OrderStatusStats[];
}
