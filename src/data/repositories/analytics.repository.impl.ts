import { AnalyticsDataSource } from '../datasources/analytics.datasource';
import { AnalyticsMapper } from '../dto/analytics.dto';
import {
    DashboardStats,
    DailySales,
    TopProduct,
    OrderStatusStats,
    AnalyticsDashboard
} from '@/domain/entities/analytics.entity';

export interface IAnalyticsRepository {
    getOverview(params?: { data_inicio?: string; data_fim?: string }): Promise<DashboardStats>;
    getDailySales(params?: { data_inicio?: string; data_fim?: string }): Promise<DailySales[]>;
    getTopProducts(params?: { limit?: number }): Promise<TopProduct[]>;
    getOrderStatusStats(): Promise<OrderStatusStats[]>;
    getFullDashboard(): Promise<AnalyticsDashboard>;
}

export class AnalyticsRepository implements IAnalyticsRepository {
    private dataSource: AnalyticsDataSource;

    constructor() {
        this.dataSource = new AnalyticsDataSource();
    }

    async getOverview(params?: { data_inicio?: string; data_fim?: string }): Promise<DashboardStats> {
        const dto = await this.dataSource.getOverview(params);
        return AnalyticsMapper.toStats(dto);
    }

    async getDailySales(params?: { data_inicio?: string; data_fim?: string }): Promise<DailySales[]> {
        const dtos = await this.dataSource.getDailySales(params);
        return (dtos || []).map(dto => AnalyticsMapper.toDailySales(dto));
    }

    async getTopProducts(params?: { limit?: number }): Promise<TopProduct[]> {
        const dtos = await this.dataSource.getTopProducts(params);
        return (dtos || []).map(dto => AnalyticsMapper.toTopProduct(dto));
    }

    async getOrderStatusStats(): Promise<OrderStatusStats[]> {
        const dtos = await this.dataSource.getOrderStatusStats();
        return (dtos || []).map(dto => AnalyticsMapper.toOrderStatus(dto));
    }

    async getFullDashboard(): Promise<AnalyticsDashboard> {
        const dto = await this.dataSource.getFullDashboard();
        return AnalyticsMapper.toDashboard(dto);
    }
}
