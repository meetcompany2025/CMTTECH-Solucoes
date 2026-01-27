import {
    AnalyticsDashboard,
    DashboardStats,
    DailySales,
    TopProduct,
    OrderStatusStats
} from '@/domain/entities/analytics.entity';

export interface DashboardStatsDTO {
    total_receita: number;
    total_pedidos: number;
    ticket_medio: number;
    crescimento_receita?: number;
    crescimento_pedidos?: number;
}

export interface DailySalesDTO {
    data: string;
    total: number;
    quantidade: number;
}

export interface TopProductDTO {
    produto_id: string;
    nome: string;
    quantidade_vendida: number;
    total_faturado: number;
    imagem?: string | null;
}

export interface OrderStatusStatsDTO {
    estado: string;
    quantidade: number;
    percentagem: number;
}

export interface FullDashboardDTO {
    overview: DashboardStatsDTO;
    vendas_diarias: DailySalesDTO[];
    produtos_top: TopProductDTO[];
    estados_encomendas: OrderStatusStatsDTO[];
}

export class AnalyticsMapper {
    static toStats(dto: DashboardStatsDTO): DashboardStats {
        return {
            total_receita: dto.total_receita || 0,
            total_pedidos: dto.total_pedidos || 0,
            ticket_medio: dto.ticket_medio || 0,
            crescimento_receita: dto.crescimento_receita || 0,
            crescimento_pedidos: dto.crescimento_pedidos || 0,
        };
    }

    static toDailySales(dto: DailySalesDTO): DailySales {
        return {
            data: dto.data,
            total: dto.total || 0,
            quantidade: dto.quantidade || 0,
        };
    }

    static toTopProduct(dto: TopProductDTO): TopProduct {
        return {
            produto_id: dto.produto_id,
            nome: dto.nome,
            quantidade_vendida: dto.quantidade_vendida || 0,
            total_faturado: dto.total_faturado || 0,
            imagem: dto.imagem,
        };
    }

    static toOrderStatus(dto: OrderStatusStatsDTO): OrderStatusStats {
        return {
            estado: dto.estado,
            quantidade: dto.quantidade || 0,
            percentagem: dto.percentagem || 0,
        };
    }

    static toDashboard(dto: FullDashboardDTO): AnalyticsDashboard {
        return {
            stats: this.toStats(dto.overview),
            vendas_diarias: (dto.vendas_diarias || []).map(d => this.toDailySales(d)),
            produtos_top: (dto.produtos_top || []).map(p => this.toTopProduct(p)),
            estados_encomendas: (dto.estados_encomendas || []).map(s => this.toOrderStatus(s)),
        };
    }
}
