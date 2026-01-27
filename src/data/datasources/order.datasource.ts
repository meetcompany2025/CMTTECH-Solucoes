import { httpClient } from '@/infrastructure/http/http-client';
import { OrderResponseDTO, OrderStatusUpdateDTO, OrderMapper } from '../dto/order.dto';
import { Order, OrderStatusUpdate, OrderSearchParams } from '@/domain/entities/order.entity';

export class OrderDataSource {
    private readonly basePath = '/orders';

    async getAll(params?: OrderSearchParams): Promise<{ orders: Order[]; total: number }> {
        const queryParams = new URLSearchParams();

        if (params?.skip) queryParams.append('skip', params.skip.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.status_pagamento) queryParams.append('status_pagamento', params.status_pagamento);
        if (params?.metodo_pagamento) queryParams.append('metodo_pagamento', params.metodo_pagamento);
        if (params?.data_inicio) queryParams.append('data_inicio', params.data_inicio);
        if (params?.data_fim) queryParams.append('data_fim', params.data_fim);

        const response = await httpClient.get<OrderResponseDTO[]>(
            `${this.basePath}/?${queryParams.toString()}`
        );

        const orders = response.data.map(dto => OrderMapper.toDomain(dto));

        return {
            orders,
            total: orders.length,
        };
    }

    async getById(id: string): Promise<Order> {
        const response = await httpClient.get<OrderResponseDTO>(`${this.basePath}/${id}`);
        return OrderMapper.toDomain(response.data);
    }

    async updateStatus(id: string, data: OrderStatusUpdate): Promise<Order> {
        const dto: OrderStatusUpdateDTO = {};
        if (data.status) dto.estado = data.status;
        if (data.status_pagamento) dto.estado_pagamento = data.status_pagamento;

        const response = await httpClient.put<OrderResponseDTO>(`${this.basePath}/${id}`, dto);
        return OrderMapper.toDomain(response.data);
    }
}
