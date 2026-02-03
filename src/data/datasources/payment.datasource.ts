import { httpClient } from '@/infrastructure/http/http-client';

export interface PaymentRequest {
    order_id: string;
    method: string;
    amount: number;
    reference?: string;
}

export interface PaymentResponse {
    id: string;
    order_id: string;
    method: string;
    amount: number;
    status: 'pendente' | 'pago' | 'falhado' | 'reembolsado';
    reference?: string;
    gateway_response?: any;
    created_at: string;
    updated_at: string;
}

export class PaymentDataSource {
    private readonly basePath = '/payments';

    async createPayment(data: PaymentRequest): Promise<PaymentResponse> {
        const response = await httpClient.post<PaymentResponse>(`${this.basePath}/`, data);
        return response.data;
    }

    async getPaymentById(id: string): Promise<PaymentResponse> {
        const response = await httpClient.get<PaymentResponse>(`${this.basePath}/${id}`);
        return response.data;
    }

    async updatePaymentStatus(id: string, status: string): Promise<PaymentResponse> {
        const response = await httpClient.patch<PaymentResponse>(`${this.basePath}/${id}/status`, { status });
        return response.data;
    }
}