import { IProductRepository } from '@/domain/repositories/product.repository.interface';
import { Product, ProductCreate, ProductUpdate, ProductSearchParams } from '@/domain/entities/product.entity';
import { ProductDataSource } from '../datasources/product.datasource';

export class ProductRepository implements IProductRepository {
    private dataSource: ProductDataSource;

    constructor() {
        this.dataSource = new ProductDataSource();
    }

    async getAll(params?: ProductSearchParams): Promise<{ products: Product[]; total: number }> {
        return this.dataSource.getAll(params);
    }

    async getById(id: string): Promise<Product> {
        return this.dataSource.getById(id);
    }

    async create(data: ProductCreate): Promise<Product> {
        return this.dataSource.create(data);
    }

    async update(id: string, data: ProductUpdate): Promise<Product> {
        return this.dataSource.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.dataSource.delete(id);
    }

    async uploadMainImage(id: string, file: File, use_supabase: boolean = true): Promise<{ image_url: string }> {
        return this.dataSource.uploadMainImage(id, file, use_supabase);
    }

    async uploadGalleryImages(id: string, files: File[], use_supabase: boolean = true): Promise<{ image_urls: string[] }> {
        return this.dataSource.uploadGalleryImages(id, files, use_supabase);
    }

    async uploadVideo(id: string, file: File, use_supabase: boolean = true): Promise<{ video_url: string }> {
        return this.dataSource.uploadVideo(id, file, use_supabase);
    }

    async search(query: string, params?: ProductSearchParams): Promise<{ products: Product[]; total: number }> {
        return this.dataSource.search(query, params);
    }
}
