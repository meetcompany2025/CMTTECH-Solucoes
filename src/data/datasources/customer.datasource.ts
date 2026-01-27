import { httpClient } from '@/infrastructure/http/http-client';
import { CustomerResponseDTO, CustomerUpdateDTO, CustomerMapper } from '../dto/customer.dto';
import { Customer, CustomerSearchParams } from '@/domain/entities/customer.entity';

export class CustomerDataSource {
    private readonly basePath = '/customers';

    async getAll(params?: CustomerSearchParams): Promise<{ customers: Customer[]; total: number }> {
        const queryParams = new URLSearchParams();

        if (params?.skip) queryParams.append('skip', params.skip.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        // Swagger snippet 227 (Alert List) showed 'name' param logic in other resource.
        // Assuming standard search for customers (e.g. searching by name/email). 
        // If API supports 'search' or 'q' or 'nome', we'd add it here.
        // For now, only pagination is confirmed by general API pattern. 
        if (params?.buscar) queryParams.append('buscar', params.buscar);

        const response = await httpClient.get<CustomerResponseDTO[]>(
            `${this.basePath}/?${queryParams.toString()}`
        );

        const customers = response.data.map(dto => CustomerMapper.toDomain(dto));

        return {
            customers,
            total: customers.length, // Or from header/envelope if available
        };
    }

    async getById(id: string): Promise<Customer> {
        const response = await httpClient.get<CustomerResponseDTO>(`${this.basePath}/${id}`);
        return CustomerMapper.toDomain(response.data);
    }

    async update(id: string, data: Partial<Customer>): Promise<Customer> {
        const dto: CustomerUpdateDTO = CustomerMapper.toUpdateDTO(data);
        const response = await httpClient.patch<CustomerResponseDTO>(`${this.basePath}/${id}`, dto);
        return CustomerMapper.toDomain(response.data);
    }
}
