import { Customer, CustomerAddress } from '@/domain/entities/customer.entity';

export interface AddressResponseDTO {
    tipo: string;
    nome_destinatario?: string | null;
    telefone?: string | null;
    provincia: string;
    municipio: string;
    bairro?: string | null;
    rua?: string | null;
    numero_casa?: string | null;
    ponto_referencia?: string | null;
}

export interface CustomerResponseDTO {
    id: string;
    nome: string;
    email: string;
    telefone?: string | null;
    nif?: string | null;
    data_nascimento?: string | null;
    genero?: string | null;
    newsletter_aceite: boolean;
    notas_internas?: string | null;
    total_compras: number;
    total_gasto: number;
    ultimo_pedido_at?: string | null;
    created_at: string;
    updated_at?: string | null;
    enderecos: AddressResponseDTO[];
}

export class CustomerMapper {
    static toDomain(dto: CustomerResponseDTO): Customer {
        return {
            id: dto.id,
            nome: dto.nome,
            email: dto.email,
            telefone: dto.telefone,
            nif: dto.nif,
            data_nascimento: dto.data_nascimento,
            genero: dto.genero,
            newsletter_aceite: dto.newsletter_aceite,
            notas_internas: dto.notas_internas,
            total_compras: dto.total_compras,
            total_gasto: dto.total_gasto,
            ultimo_pedido_at: dto.ultimo_pedido_at,
            created_at: dto.created_at,
            updated_at: dto.updated_at || dto.created_at,
            enderecos: (dto.enderecos || []).map(addr => ({
                tipo: addr.tipo,
                nome_destinatario: addr.nome_destinatario,
                telefone: addr.telefone,
                provincia: addr.provincia,
                municipio: addr.municipio,
                bairro: addr.bairro,
                rua: addr.rua,
                numero_casa: addr.numero_casa,
                ponto_referencia: addr.ponto_referencia,
            })),
        };
    }

    static toUpdateDTO(data: Partial<Customer>): CustomerUpdateDTO {
        return {
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            nif: data.nif,
            data_nascimento: data.data_nascimento,
            genero: data.genero,
            newsletter_aceite: data.newsletter_aceite,
            notas_internas: data.notas_internas,
        };
    }
}

export interface CustomerUpdateDTO {
    nome?: string;
    email?: string;
    telefone?: string | null;
    nif?: string | null;
    data_nascimento?: string | null;
    genero?: string | null;
    newsletter_aceite?: boolean;
    notas_internas?: string | null;
}
