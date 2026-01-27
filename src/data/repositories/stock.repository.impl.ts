import { IStockRepository } from '../../domain/repositories/stock.repository.interface';
import { StockDataSource } from '../datasources/stock.datasource';
import { StockLevel, StockMovement, StockAdjustmentRequest, StockSummary } from '../../domain/entities/stock.entity';

export class StockRepositoryImpl implements IStockRepository {
    private dataSource: StockDataSource;

    constructor(dataSource: StockDataSource) {
        this.dataSource = dataSource;
    }

    async getLevels(params?: any): Promise<{ levels: StockLevel[]; total: number }> {
        return this.dataSource.getLevels(params);
    }

    async getProductLevels(productId: string): Promise<StockLevel[]> {
        return this.dataSource.getProductLevels(productId);
    }

    async getMovements(params?: any): Promise<{ movements: StockMovement[]; total: number }> {
        return this.dataSource.getMovements(params);
    }

    async adjustStock(request: StockAdjustmentRequest): Promise<void> {
        return this.dataSource.adjustStock(request);
    }

    async getSummary(): Promise<StockSummary> {
        return this.dataSource.getSummary();
    }
}
