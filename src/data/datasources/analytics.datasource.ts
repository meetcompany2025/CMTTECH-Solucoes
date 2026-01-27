import { httpClient } from '@/infrastructure/http/http-client';
import {
    DashboardStatsDTO,
    DailySalesDTO,
    TopProductDTO,
    OrderStatusStatsDTO,
    FullDashboardDTO
} from '../dto/analytics.dto';

export class AnalyticsDataSource {
    private basePath = '/analytics';

    async getOverview(params?: { data_inicio?: string; data_fim?: string }): Promise<DashboardStatsDTO> {
        const response = await httpClient.get<DashboardStatsDTO>(`${this.basePath}/overview`, { params });
        return response.data;
    }

    async getDailySales(params?: { data_inicio?: string; data_fim?: string }): Promise<DailySalesDTO[]> {
        const response = await httpClient.get<DailySalesDTO[]>(`${this.basePath}/daily-sales`, { params });
        return response.data;
    }

    async getTopProducts(params?: { limit?: number }): Promise<TopProductDTO[]> {
        const response = await httpClient.get<TopProductDTO[]>(`${this.basePath}/top-products`, { params });
        return response.data;
    }

    async getOrderStatusStats(): Promise<OrderStatusStatsDTO[]> {
        const response = await httpClient.get<OrderStatusStatsDTO[]>(`${this.basePath}/order-status`);
        return response.data;
    }

    async getFullDashboard(): Promise<FullDashboardDTO> {
        const response = await httpClient.get<FullDashboardDTO>(`${this.basePath}/dashboard`);
        return response.data;
    }
}
