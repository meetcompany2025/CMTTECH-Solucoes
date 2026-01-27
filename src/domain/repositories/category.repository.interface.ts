import { Category, CategoryCreate, CategoryUpdate } from '../entities/category.entity';

export interface ICategoryRepository {
    /**
     * Get all categories
     */
    getAll(): Promise<Category[]>;

    /**
     * Get a single category by ID
     */
    getById(id: string): Promise<Category>;

    /**
     * Create a new category
     */
    create(data: CategoryCreate): Promise<Category>;

    /**
     * Update an existing category
     */
    update(id: string, data: CategoryUpdate): Promise<Category>;

    /**
     * Delete a category
     */
    delete(id: string): Promise<void>;

    /**
     * Reorder categories
     */
    reorder(categoryIds: string[]): Promise<void>;
}
