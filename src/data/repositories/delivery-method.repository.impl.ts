import { DeliveryMethod, DeliveryMethodCreate, DeliveryMethodUpdate } from '@/domain/entities/delivery-method.entity';
import { DeliveryMethodDataSource } from '../datasources/delivery-method.datasource';

export class DeliveryMethodRepository {
    private dataSource: DeliveryMethodDataSource;

    constructor() {
        this.dataSource = new DeliveryMethodDataSource();
    }

    async getAll(params?: { skip?: number; limit?: number }): Promise<DeliveryMethod[]> {
        return this.dataSource.getAll(params);
    }

    async getById(id: string): Promise<DeliveryMethod> {
        return this.dataSource.getById(id);
    }

    async create(data: DeliveryMethodCreate): Promise<DeliveryMethod> {
        return this.dataSource.create(data);
    }

    async update(id: string, data: DeliveryMethodUpdate): Promise<DeliveryMethod> {
        return this.dataSource.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.dataSource.delete(id);
    }
}
