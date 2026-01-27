import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Search } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/admin/data-table';
import { CustomerRepository } from '@/data/repositories/customer.repository.impl';
import { Customer } from '@/domain/entities/customer.entity';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

const customerRepository = new CustomerRepository();

export default function CustomersList() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async (searchTerm?: string) => {
        try {
            setLoading(true);
            const data = await customerRepository.getAll({
                limit: 100,
                buscar: searchTerm
            });
            setCustomers(data.customers);
        } catch (error) {
            toast.error('Falha ao carregar clientes');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadCustomers(search);
    };

    const columns: ColumnDef<Customer>[] = [
        {
            accessorKey: 'nome',
            header: 'Nome',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.nome}</span>
                    <span className="text-xs text-muted-foreground">{row.original.email}</span>
                </div>
            ),
        },
        {
            accessorKey: 'telefone',
            header: 'Telefone',
            cell: ({ row }) => row.original.telefone || 'N/A',
        },
        {
            accessorKey: 'nif',
            header: 'NIF',
            cell: ({ row }) => row.original.nif || 'N/A',
        },
        {
            accessorKey: 'total_gasto',
            header: 'Total Gasto',
            cell: ({ row }) => formatCurrency(row.original.total_gasto),
        },
        {
            accessorKey: 'total_compras',
            header: 'Pedidos',
            cell: ({ row }) => row.original.total_compras,
        },
        {
            accessorKey: 'created_at',
            header: 'Registado em',
            cell: ({ row }) => format(new Date(row.original.created_at), 'dd/MM/yyyy'),
        },
        {
            id: 'actions',
            header: 'Ações',
            cell: ({ row }) => (
                <Link to={`/admin/customers/${row.original.id}`}>
                    <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Clientes</h1>
                    <p className="text-muted-foreground">Gerir base de clientes</p>
                </div>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
                <Input
                    placeholder="Buscar por nome ou email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button type="submit" variant="secondary">
                    <Search className="h-4 w-4" />
                </Button>
            </form>

            <DataTable columns={columns} data={customers} loading={loading} />
        </div>
    );
}
