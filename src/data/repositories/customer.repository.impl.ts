import { ICustomerRepository } from '@/domain/repositories/customer.repository.interface';
import { CustomerDataSource } from '../datasources/customer.datasource';
import { Customer, CustomerSearchParams } from '@/domain/entities/customer.entity';

export class CustomerRepository implements ICustomerRepository {
    private dataSource: CustomerDataSource;

    constructor() {
        this.dataSource = new CustomerDataSource();
    }

    async getAll(params?: CustomerSearchParams): Promise<{ customers: Customer[]; total: number }> {
        return this.dataSource.getAll(params);
    }

    async getById(id: string): Promise<Customer> {
        return this.dataSource.getById(id);
    }

    async update(id: string, data: Partial<Customer>): Promise<Customer> {
        return this.dataSource.update(id, data);
    }
}
