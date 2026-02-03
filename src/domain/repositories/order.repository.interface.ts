import { Order, OrderStatusUpdate, OrderSearchParams } from '../entities/order.entity';
import { OrderCreateDTO } from '@/data/dto/order.dto';

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

    /**
     * Create a new order
     */
    createOrder(orderData: OrderCreateDTO): Promise<Order>;
}
