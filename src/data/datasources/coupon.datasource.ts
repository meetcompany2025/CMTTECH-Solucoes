import { httpClient } from '@/infrastructure/http/http-client';
import { CouponResponseDTO, CouponCreateDTO, CouponUpdateDTO, CouponMapper } from '../dto/coupon.dto';
import { Coupon, CouponCreate, CouponUpdate } from '@/domain/entities/coupon.entity';

export class CouponDataSource {
    private readonly basePath = '/sales/coupons';

    async getAll(params?: { skip?: number; limit?: number }): Promise<Coupon[]> {
        const queryParams = new URLSearchParams();
        if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
        if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());

        const url = queryParams.toString() ? `${this.basePath}?${queryParams}` : this.basePath;
        const response = await httpClient.get<CouponResponseDTO[]>(url);
        
        // Handle both array and items wrapper response
        const data = Array.isArray(response.data) ? response.data : (response.data as any).items || [];
        return data.map((dto: CouponResponseDTO) => CouponMapper.toDomain(dto));
    }

    async getById(id: string): Promise<Coupon> {
        const response = await httpClient.get<CouponResponseDTO>(`${this.basePath}/${id}`);
        return CouponMapper.toDomain(response.data);
    }

    async create(data: CouponCreate): Promise<Coupon> {
        const dto = CouponMapper.toCreateDTO(data);
        const response = await httpClient.post<CouponResponseDTO>(this.basePath, dto);
        return CouponMapper.toDomain(response.data);
    }

    async update(id: string, data: CouponUpdate): Promise<Coupon> {
        const dto = CouponMapper.toUpdateDTO(data);
        const response = await httpClient.put<CouponResponseDTO>(`${this.basePath}/${id}`, dto);
        return CouponMapper.toDomain(response.data);
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete(`${this.basePath}/${id}`);
    }
}
