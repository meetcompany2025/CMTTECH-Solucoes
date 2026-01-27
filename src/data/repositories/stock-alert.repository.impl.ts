import { IStockAlertRepository } from '@/domain/repositories/stock-alert.repository.interface';
import { StockAlertDataSource } from '../datasources/stock-alert.datasource';
import { StockAlert, StockAlertCreate, StockAlertUpdate, StockAlertSearchParams } from '@/domain/entities/stock-alert.entity';
import { ProductRepository } from './product.repository.impl';

export class StockAlertRepository implements IStockAlertRepository {
    private dataSource: StockAlertDataSource;
    private productRepository: ProductRepository;

    constructor() {
        this.dataSource = new StockAlertDataSource();
        this.productRepository = new ProductRepository();
    }

    async getAll(params?: StockAlertSearchParams): Promise<{ alerts: StockAlert[]; total: number }> {
        const result = await this.dataSource.getAll(params);

        // Ensure result and result.alerts exist
        if (!result || !Array.isArray(result.alerts)) {
            console.error('Invalid response from StockAlertDataSource.getAll:', result);
            return { alerts: [], total: 0 };
        }

        const { alerts, total } = result;

        // Enrich with product information only for alerts that don't have it
        const alertsToEnrich = alerts.filter(a => !a.produto_nome);

        if (alertsToEnrich.length > 0) {
            try {
                const productResult = await this.productRepository.getAll({ limit: 1000 });
                if (productResult && Array.isArray(productResult.products)) {
                    const productMap = new Map(productResult.products.map(p => [p.id, p]));

                    alertsToEnrich.forEach(alert => {
                        const product = productMap.get(alert.product_id);
                        if (product) {
                            alert.produto_nome = product.nome;
                        }
                    });
                }
            } catch (error) {
                console.warn('Failed to fetch products for enriching alerts:', error);
            }
        }

        return { alerts, total };
    }

    async getById(id: string): Promise<StockAlert> {
        let alert = await this.dataSource.getById(id);

        try {
            const product = await this.productRepository.getById(alert.product_id);
            alert.produto_nome = product.nome;
        } catch (error) {
            console.warn('Failed to fetch product for alert:', error);
        }

        return alert;
    }

    async create(data: StockAlertCreate): Promise<StockAlert> {
        return this.dataSource.create(data);
    }

    async update(id: string, data: StockAlertUpdate): Promise<StockAlert> {
        return this.dataSource.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.dataSource.delete(id);
    }

    async checkAlerts(): Promise<void> {
        return this.dataSource.checkAlerts();
    }
}
