import { StockAlert, StockAlertCreate, StockAlertUpdate, StockAlertSearchParams } from '../entities/stock-alert.entity';

export interface IStockAlertRepository {
    getAll(params?: StockAlertSearchParams): Promise<{ alerts: StockAlert[]; total: number }>;
    getById(id: string): Promise<StockAlert>;
    create(data: StockAlertCreate): Promise<StockAlert>;
    update(id: string, data: StockAlertUpdate): Promise<StockAlert>;
    delete(id: string): Promise<void>;
    checkAlerts(): Promise<void>; // To manual trigger check
}
