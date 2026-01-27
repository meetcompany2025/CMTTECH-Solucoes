import { ICategoryRepository } from '@/domain/repositories/category.repository.interface';
import { Category, CategoryCreate, CategoryUpdate } from '@/domain/entities/category.entity';
import { CategoryDataSource } from '../datasources/category.datasource';

export class CategoryRepository implements ICategoryRepository {
    private dataSource: CategoryDataSource;

    constructor() {
        this.dataSource = new CategoryDataSource();
    }

    async getAll(): Promise<Category[]> {
        return this.dataSource.getAll();
    }

    async getById(id: string): Promise<Category> {
        return this.dataSource.getById(id);
    }

    async create(data: CategoryCreate): Promise<Category> {
        return this.dataSource.create(data);
    }

    async update(id: string, data: CategoryUpdate): Promise<Category> {
        return this.dataSource.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.dataSource.delete(id);
    }

    async reorder(categoryIds: string[]): Promise<void> {
        return this.dataSource.reorder(categoryIds);
    }
}
