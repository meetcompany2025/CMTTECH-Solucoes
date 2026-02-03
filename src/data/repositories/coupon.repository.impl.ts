import { Coupon, CouponCreate, CouponUpdate } from '@/domain/entities/coupon.entity';
import { CouponDataSource } from '../datasources/coupon.datasource';

export class CouponRepository {
    private dataSource: CouponDataSource;

    constructor() {
        this.dataSource = new CouponDataSource();
    }

    async getAll(params?: { skip?: number; limit?: number }): Promise<Coupon[]> {
        return this.dataSource.getAll(params);
    }

    async getById(id: string): Promise<Coupon> {
        return this.dataSource.getById(id);
    }

    async create(data: CouponCreate): Promise<Coupon> {
        return this.dataSource.create(data);
    }

    async update(id: string, data: CouponUpdate): Promise<Coupon> {
        return this.dataSource.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.dataSource.delete(id);
    }
}
