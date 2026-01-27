import { Product, ProductCreate, ProductUpdate, ProductSearchParams } from '../entities/product.entity';

export interface IProductRepository {
    /**
     * Get all products with optional search/filter parameters
     */
    getAll(params?: ProductSearchParams): Promise<{ products: Product[]; total: number }>;

    /**
     * Get a single product by ID
     */
    getById(id: string): Promise<Product>;

    /**
     * Create a new product
     */
    create(data: ProductCreate): Promise<Product>;

    /**
     * Update an existing product
     */
    update(id: string, data: ProductUpdate): Promise<Product>;

    /**
     * Delete a product
     */
    delete(id: string): Promise<void>;

    /**
     * Upload main product image
     */
    uploadMainImage(id: string, file: File, use_supabase?: boolean): Promise<{ image_url: string }>;

    /**
     * Upload gallery images
     */
    uploadGalleryImages(id: string, files: File[], use_supabase?: boolean): Promise<{ image_urls: string[] }>;

    /**
     * Upload product video
     */
    uploadVideo(id: string, file: File, use_supabase?: boolean): Promise<{ video_url: string }>;

    /**
     * Search products
     */
    search(query: string, params?: ProductSearchParams): Promise<{ products: Product[]; total: number }>;
}
