import { httpClient } from '@/infrastructure/http/http-client';
import { ProductResponseDTO, ProductCreateDTO, ProductUpdateDTO, ProductMapper } from '../dto/product.dto';
import { Product, ProductCreate, ProductUpdate, ProductSearchParams } from '@/domain/entities/product.entity';

export class ProductDataSource {
    private readonly basePath = '/products';

    async getAll(params?: ProductSearchParams): Promise<{ products: Product[]; total: number }> {
        const queryParams = new URLSearchParams();

        if (params?.skip) queryParams.append('skip', params.skip.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.nome) queryParams.append('nome', params.nome);
        if (params?.categoria_id) queryParams.append('categoria_id', params.categoria_id);
        if (params?.preco_min) queryParams.append('preco_min', params.preco_min.toString());
        if (params?.preco_max) queryParams.append('preco_max', params.preco_max.toString());
        if (params?.em_stock !== undefined) queryParams.append('em_stock', params.em_stock.toString());
        if (params?.ativo !== undefined) queryParams.append('ativo', params.ativo.toString());
        if (params?.destaque !== undefined) queryParams.append('destaque', params.destaque.toString());

        const response = await httpClient.get<ProductResponseDTO[]>(
            `${this.basePath}/?${queryParams.toString()}`
        );

        const products = response.data.map(dto => ProductMapper.toDomain(dto));

        return {
            products,
            total: products.length, // API might return total in header or response
        };
    }

    async getById(id: string): Promise<Product> {
        const response = await httpClient.get<ProductResponseDTO>(`${this.basePath}/${id}`);
        return ProductMapper.toDomain(response.data);
    }

    async create(data: ProductCreate): Promise<Product> {
        const dto = ProductMapper.toCreateDTO(data);
        const response = await httpClient.post<ProductResponseDTO>(`${this.basePath}/`, dto);
        return ProductMapper.toDomain(response.data);
    }

    async update(id: string, data: ProductUpdate): Promise<Product> {
        const dto = ProductMapper.toUpdateDTO(data);
        const response = await httpClient.put<ProductResponseDTO>(`${this.basePath}/${id}`, dto);
        return ProductMapper.toDomain(response.data);
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete(`${this.basePath}/${id}`);
    }

    async uploadMainImage(id: string, file: File, use_supabase: boolean = true): Promise<{ image_url: string }> {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('use_supabase', use_supabase.toString());

        const response = await httpClient.post<{ image_url: string }>(
            `${this.basePath}/${id}/upload-main-image`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    }

    async uploadGalleryImages(id: string, files: File[], use_supabase: boolean = true): Promise<{ image_urls: string[] }> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });
        formData.append('use_supabase', use_supabase.toString());

        const response = await httpClient.post<{ image_urls: string[] }>(
            `${this.basePath}/${id}/upload-gallery-images`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    }

    async uploadVideo(id: string, file: File, use_supabase: boolean = true): Promise<{ video_url: string }> {
        const formData = new FormData();
        formData.append('video', file);
        formData.append('use_supabase', use_supabase.toString());

        const response = await httpClient.post<{ video_url: string }>(
            `${this.basePath}/${id}/upload-video`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    }

    async search(query: string, params?: ProductSearchParams): Promise<{ products: Product[]; total: number }> {
        const queryParams = new URLSearchParams({ nome: query });

        if (params?.skip) queryParams.append('skip', params.skip.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.categoria_id) queryParams.append('categoria_id', params.categoria_id);
        if (params?.preco_min) queryParams.append('preco_min', params.preco_min.toString());
        if (params?.preco_max) queryParams.append('preco_max', params.preco_max.toString());

        const response = await httpClient.get<ProductResponseDTO[]>(
            `${this.basePath}/search?${queryParams.toString()}`
        );

        const products = response.data.map(dto => ProductMapper.toDomain(dto));

        return {
            products,
            total: products.length,
        };
    }
}
