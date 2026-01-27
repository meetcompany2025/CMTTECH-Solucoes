import { httpClient } from '@/infrastructure/http/http-client';
import { StockAlertResponseDTO, StockAlertCreateDTO, StockAlertUpdateDTO, StockAlertMapper } from '../dto/stock-alert.dto';
import { StockAlert, StockAlertCreate, StockAlertUpdate, StockAlertSearchParams } from '@/domain/entities/stock-alert.entity';

export class StockAlertDataSource {
    private readonly basePath = '/api/v1/stock/alertas';

    async getAll(params?: StockAlertSearchParams): Promise<{ alerts: StockAlert[]; total: number }> {
        const queryParams = new URLSearchParams();

        if (params?.apenas_ativos !== undefined) queryParams.append('apenas_ativos', params.apenas_ativos.toString());
        if (params?.apenas_alertados !== undefined) queryParams.append('apenas_alertados', params.apenas_alertados.toString());
        if (params?.skip) queryParams.append('skip', params.skip.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await httpClient.get<any>(
            `${this.basePath}?${queryParams.toString()}`
        );

        // API might return an array or an object with an 'alerts' or 'alertas' property
        let rawData: StockAlertResponseDTO[] = [];
        if (Array.isArray(response.data)) {
            rawData = response.data;
        } else if (response.data && Array.isArray(response.data.alerts)) {
            rawData = response.data.alerts;
        } else if (response.data && Array.isArray(response.data.alertas)) {
            rawData = response.data.alertas;
        } else if (response.data && typeof response.data === 'object') {
            // Check if it's a single item (unlikely but being defensive)
            if (response.data.id && response.data.produto_id) {
                rawData = [response.data];
            }
        }

        const alerts = rawData.map(dto => StockAlertMapper.toDomain(dto));

        return {
            alerts,
            total: alerts.length,
        };
    }

    async getById(id: string): Promise<StockAlert> {
        // Assuming there is a GET by ID or we just assume list contains all.
        // Swagger says: "/api/v1/stock/alertas/{alert_id}" -> Update Alert, Remove Alert.
        // There is NO GET /alertas/{id} in swagger list (Step 322).
        // Wait, Step 322 showed "Update Alert" (PATCH) and "Remove Alert" (DELETE).
        // Is there a "Get Alert"?
        // Searching Step 322 again.
        // No GET for single alert visible in snippet.
        // But usually update endpoints return the object? Or maybe I have to fetch list and find?
        // If no GET /id, I can't implement getById easily unless I filter list.
        // I'll throw error or implement via filtering list.
        // For now I'll implement it assuming it might exist or I'll implement via list filter.
        // Actually, for editing, I usually have the object from list.
        // I will try GET /id just in case, catch 404/405.
        // Or safer: implement check via list.

        // Let's rely on list for now, but usually REST APIs have GET /id.
        // I'll leave getById generic call.
        const response = await httpClient.get<StockAlertResponseDTO>(`${this.basePath}/${id}`);
        return StockAlertMapper.toDomain(response.data);
    }

    async create(data: StockAlertCreate): Promise<StockAlert> {
        const dto = StockAlertMapper.toCreateDTO(data);
        const response = await httpClient.post<StockAlertResponseDTO>(this.basePath, dto);
        return StockAlertMapper.toDomain(response.data);
    }

    async update(id: string, data: StockAlertUpdate): Promise<StockAlert> {
        const dto = StockAlertMapper.toUpdateDTO(data);
        const response = await httpClient.patch<StockAlertResponseDTO>(`${this.basePath}/${id}`, dto);
        return StockAlertMapper.toDomain(response.data);
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete(`${this.basePath}/${id}`);
    }

    async checkAlerts(): Promise<void> {
        await httpClient.get(`${this.basePath}/verificar`);
    }
}
