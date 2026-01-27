import { StockLevel, StockMovement, StockAdjustmentRequest, StockSummary } from '../entities/stock.entity';

export interface IStockRepository {
    getLevels(params?: any): Promise<{ levels: StockLevel[]; total: number }>;
    getProductLevels(productId: string): Promise<StockLevel[]>;
    getMovements(params?: any): Promise<{ movements: StockMovement[]; total: number }>;
    adjustStock(request: StockAdjustmentRequest): Promise<void>;
    getSummary(): Promise<StockSummary>;
}
