import { IOrderRepository } from '@/domain/repositories/order.repository.interface';
import { Order, OrderStatusUpdate, OrderSearchParams } from '@/domain/entities/order.entity';
import { OrderDataSource } from '../datasources/order.datasource';
import { OrderCreateDTO } from '../dto/order.dto';

export class OrderRepository implements IOrderRepository {
    private dataSource: OrderDataSource;

    constructor() {
        this.dataSource = new OrderDataSource();
    }

    async getAll(params?: OrderSearchParams): Promise<{ orders: Order[]; total: number }> {
        return this.dataSource.getAll(params);
    }

    async getById(id: string): Promise<Order> {
        return this.dataSource.getById(id);
    }

    async updateStatus(id: string, data: OrderStatusUpdate): Promise<Order> {
        return this.dataSource.updateStatus(id, data);
    }

    async createOrder(orderData: OrderCreateDTO): Promise<Order> {
        return this.dataSource.createOrder(orderData);
    }
}
