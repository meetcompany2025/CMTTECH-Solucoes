import { Order, OrderStatusUpdate, OrderSearchParams } from '../entities/order.entity';

export interface IOrderRepository {
    /**
     * Get all orders with optional filters
     */
    getAll(params?: OrderSearchParams): Promise<{ orders: Order[]; total: number }>;

    /**
     * Get a single order by ID
     */
    getById(id: string): Promise<Order>;

    /**
     * Update order status
     */
    updateStatus(id: string, data: OrderStatusUpdate): Promise<Order>;
}
