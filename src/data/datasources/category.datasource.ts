import { httpClient } from '@/infrastructure/http/http-client';
import { CategoryResponseDTO, CategoryCreateDTO, CategoryUpdateDTO, CategoryMapper } from '../dto/category.dto';
import { Category, CategoryCreate, CategoryUpdate } from '@/domain/entities/category.entity';

export class CategoryDataSource {
    private readonly basePath = '/categories';

    async getAll(): Promise<Category[]> {
        const response = await httpClient.get<CategoryResponseDTO[]>(`${this.basePath}/`);
        return response.data.map(dto => CategoryMapper.toDomain(dto));
    }

    async getById(id: string): Promise<Category> {
        const response = await httpClient.get<CategoryResponseDTO>(`${this.basePath}/${id}`);
        return CategoryMapper.toDomain(response.data);
    }

    async create(data: CategoryCreate): Promise<Category> {
        const dto = CategoryMapper.toCreateDTO(data);
        const response = await httpClient.post<CategoryResponseDTO>(`${this.basePath}/`, dto);
        return CategoryMapper.toDomain(response.data);
    }

    async update(id: string, data: CategoryUpdate): Promise<Category> {
        const dto = CategoryMapper.toUpdateDTO(data);
        const response = await httpClient.put<CategoryResponseDTO>(`${this.basePath}/${id}`, dto);
        return CategoryMapper.toDomain(response.data);
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete(`${this.basePath}/${id}`);
    }

    async reorder(categoryIds: string[]): Promise<void> {
        // Update each category's ordem based on position in array
        const updates = categoryIds.map((id, index) =>
            this.update(id, { ordem: index })
        );
        await Promise.all(updates);
    }
}
