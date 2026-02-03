import { httpClient } from '@/infrastructure/http/http-client';
import { 
    PaymentInitiateRequest, 
    PaymentInitiateResponse, 
    PaymentConfirmRequest, 
    PaymentConfirmResponse, 
    PaymentRefundRequest, 
    PaymentRefundResponse,
    PaymentStatistics 
} from '@/domain/entities/payment.entity';

export interface IPaymentRepository {
    initiatePayment(data: PaymentInitiateRequest): Promise<PaymentInitiateResponse>;
    confirmPayment(data: PaymentConfirmRequest): Promise<PaymentConfirmResponse>;
    refundPayment(data: PaymentRefundRequest): Promise<PaymentRefundResponse>;
    getPaymentById(id: string): Promise<any>;
    listPayments(params?: {
        skip?: number;
        limit?: number;
        estado?: string;
        metodo?: string;
        data_inicio?: string;
        data_fim?: string;
    }): Promise<any>;
    getPaymentStats(params?: {
        data_inicio?: string;
        data_fim?: string;
    }): Promise<PaymentStatistics>;
}

export class PaymentRepository implements IPaymentRepository {
    private readonly basePath = '/pagamentos';

    async initiatePayment(data: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
        const response = await httpClient.post<PaymentInitiateResponse>(`${this.basePath}/criar`, data);
        return response.data;
    }

    async confirmPayment(data: PaymentConfirmRequest): Promise<PaymentConfirmResponse> {
        const response = await httpClient.post<PaymentInitiateResponse>(`${this.basePath}/${data.pagamento_id}/confirmar`, data);
        return response.data;
    }

    async refundPayment(data: PaymentRefundRequest): Promise<PaymentRefundResponse> {
        const response = await httpClient.post<PaymentRefundResponse>(`${this.basePath}/${data.pagamento_id}/reembolsar`, data);
        return response.data;
    }

    async getPaymentById(id: string): Promise<any> {
        const response = await httpClient.get(`${this.basePath}/${id}`);
        return response.data;
    }

    async listPayments(params?: any): Promise<any> {
        const queryParams = new URLSearchParams();
        
        if (params?.skip) queryParams.append('skip', params.skip.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.estado) queryParams.append('estado', params.estado);
        if (params?.metodo) queryParams.append('metodo', params.metodo);
        if (params?.data_inicio) queryParams.append('data_inicio', params.data_inicio);
        if (params?.data_fim) queryParams.append('data_fim', params.data_fim);

        const response = await httpClient.get(`${this.basePath}/?${queryParams.toString()}`);
        return response.data;
    }

    async getPaymentStats(params?: any): Promise<PaymentStatistics> {
        const queryParams = new URLSearchParams();
        
        if (params?.data_inicio) queryParams.append('data_inicio', params.data_inicio);
        if (params?.data_fim) queryParams.append('data_fim', params.data_fim);

        const response = await httpClient.get<PaymentStatistics>(`${this.basePath}/stats/resumo?${queryParams.toString()}`);
        return response.data;
    }
}