import { httpClient } from '../../infrastructure/http/http-client';
import { StockLevelResponseDTO, StockMovementResponseDTO, StockSummaryResponseDTO, StockMapper } from '../dto/stock.dto';
import { StockLevel, StockMovement, StockAdjustmentRequest, StockSummary } from '../../domain/entities/stock.entity';

export class StockDataSource {
    private basePath = '/api/v1/stock';

    async getLevels(params?: any): Promise<{ levels: StockLevel[]; total: number }> {
        const response = await httpClient.get<any>(`${this.basePath}/levels`, { params });
        const rawData = response.data.levels || [];
        return {
            levels: rawData.map((dto: StockLevelResponseDTO) => StockMapper.toLevel(dto)),
            total: response.data.total || rawData.length
        };
    }

    async getProductLevels(productId: string): Promise<StockLevel[]> {
        const response = await httpClient.get<StockLevelResponseDTO[]>(`${this.basePath}/produto/${productId}/nivel`);
        return response.data.map(dto => StockMapper.toLevel(dto));
    }

    async getMovements(params?: any): Promise<{ movements: StockMovement[]; total: number }> {
        const response = await httpClient.get<any>(`${this.basePath}/movimentos`, { params });
        const rawData = response.data.movements || [];
        return {
            movements: rawData.map((dto: StockMovementResponseDTO) => StockMapper.toMovement(dto)),
            total: response.data.total || rawData.length
        };
    }

    async adjustStock(request: StockAdjustmentRequest): Promise<void> {
        await httpClient.post(`${this.basePath}/ajuste`, StockMapper.toAdjustmentRequest(request));
    }

    async getSummary(): Promise<StockSummary> {
        const response = await httpClient.get<StockSummaryResponseDTO>(`${this.basePath}/summary`);
        return StockMapper.toSummary(response.data);
    }
}
