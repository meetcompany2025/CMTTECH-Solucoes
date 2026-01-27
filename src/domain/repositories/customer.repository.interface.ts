import { Customer, CustomerSearchParams } from '../entities/customer.entity';

export interface ICustomerRepository {
    getAll(params?: CustomerSearchParams): Promise<{ customers: Customer[]; total: number }>;
    getById(id: string): Promise<Customer>;
    // create? Usually customers register themselves, but admin might creating one? 
    // Swagger snippet 5927 mentioned "Email" "Telefone" etc in Create/Update context? 
    // Step 284 showed "ProductCreate". 
    // Step 286 showed "CustomerUpdate".
    // I'll skip Create for now unless needed. Admin usually views customers.
    update(id: string, data: Partial<Customer>): Promise<Customer>;
}
