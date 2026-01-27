import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { OrderRepository } from '@/data/repositories/order.repository.impl';
import { Order } from '@/domain/entities/order.entity';
import { toast } from 'sonner';

const orderRepository = new OrderRepository();

export default function OrdersList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await orderRepository.getAll({ limit: 100 });
            setOrders(data.orders);
        } catch (error) {
            toast.error('Falha ao carregar encomendas');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: 'numero_pedido',
            header: 'Encomenda',
            cell: ({ row }) => <span className="font-mono font-medium">{row.original.numero_pedido}</span>,
        },
        {
            accessorKey: 'customer_nome',
            header: 'Cliente',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">
                        {row.original.customer_nome || 'Cliente Removido'}
                    </span>
                    <span className="text-xs text-muted-foreground">{row.original.customer_email}</span>
                </div>
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Data',
            cell: ({ row }) => formatDate(row.original.created_at),
        },
        {
            accessorKey: 'total',
            header: 'Total',
            cell: ({ row }) => formatCurrency(row.original.total),
        },
        {
            accessorKey: 'status',
            header: 'Estado',
            cell: ({ row }) => <StatusBadge status={row.original.status} variant="order" />,
        },
        {
            accessorKey: 'status_pagamento',
            header: 'Pagamento',
            cell: ({ row }) => <StatusBadge status={row.original.status_pagamento} variant="payment" />,
        },
        {
            id: 'actions',
            header: 'Ações',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Link to={`/admin/orders/${row.original.id}`}>
                        <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver Detalhes</span>
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Encomendas</h1>
                    <p className="text-muted-foreground">Gerir encomendas e estado de pagamentos</p>
                </div>
            </div>

            <DataTable columns={columns} data={orders} loading={loading} />
        </div>
    );
}
