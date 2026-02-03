import { httpClient } from '@/infrastructure/http/http-client';
import { DeliveryMethodResponseDTO, DeliveryMethodCreateDTO, DeliveryMethodUpdateDTO, DeliveryMethodMapper } from '../dto/delivery-method.dto';
import { DeliveryMethod, DeliveryMethodCreate, DeliveryMethodUpdate } from '@/domain/entities/delivery-method.entity';

export class DeliveryMethodDataSource {
    private readonly basePath = '/sales/delivery-methods';

    async getAll(params?: { skip?: number; limit?: number }): Promise<DeliveryMethod[]> {
        const queryParams = new URLSearchParams();
        if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
        if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());

        const url = queryParams.toString() ? `${this.basePath}?${queryParams}` : this.basePath;
        const response = await httpClient.get<DeliveryMethodResponseDTO[]>(url);
        
        // Handle both array and items wrapper response
        const data = Array.isArray(response.data) ? response.data : (response.data as any).items || [];
        return data.map((dto: DeliveryMethodResponseDTO) => DeliveryMethodMapper.toDomain(dto));
    }

    async getById(id: string): Promise<DeliveryMethod> {
        const response = await httpClient.get<DeliveryMethodResponseDTO>(`${this.basePath}/${id}`);
        return DeliveryMethodMapper.toDomain(response.data);
    }

    async create(data: DeliveryMethodCreate): Promise<DeliveryMethod> {
        const dto = DeliveryMethodMapper.toCreateDTO(data);
        const response = await httpClient.post<DeliveryMethodResponseDTO>(this.basePath, dto);
        return DeliveryMethodMapper.toDomain(response.data);
    }

    async update(id: string, data: DeliveryMethodUpdate): Promise<DeliveryMethod> {
        const dto = DeliveryMethodMapper.toUpdateDTO(data);
        const response = await httpClient.put<DeliveryMethodResponseDTO>(`${this.basePath}/${id}`, dto);
        return DeliveryMethodMapper.toDomain(response.data);
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete(`${this.basePath}/${id}`);
    }
}
