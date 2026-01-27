import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Bell, CheckCircle, XCircle } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/data-table';
import { StockAlertRepository } from '@/data/repositories/stock-alert.repository.impl';
import { StockAlert } from '@/domain/entities/stock-alert.entity';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const stockAlertRepository = new StockAlertRepository();

export default function StockAlertsList() {
    const [alerts, setAlerts] = useState<StockAlert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        try {
            setLoading(true);
            const data = await stockAlertRepository.getAll();
            if (data && Array.isArray(data.alerts)) {
                setAlerts(data.alerts);
            } else {
                setAlerts([]);
            }
        } catch (error) {
            toast.error('Falha ao carregar alertas');
        } finally {
            setLoading(false);
        }
    };

    const checkAlertsNow = async () => {
        try {
            setLoading(true);
            await stockAlertRepository.checkAlerts();
            toast.success('Verificação de alertas executada');
            await loadAlerts();
        } catch (error) {
            toast.error('Falha ao verificar alertas');
            setLoading(false);
        }
    };

    const columns: ColumnDef<StockAlert>[] = [
        {
            accessorKey: 'produto_nome',
            header: 'Produto',
            cell: ({ row }) => <span className="font-medium">{row.original.produto_nome || 'Produto desconhecido'}</span>,
        },
        {
            accessorKey: 'stock_atual',
            header: 'Stock Atual',
            cell: ({ row }) => {
                const stock = row.original.stock_atual ?? 0;
                const isCritical = row.original.abaixo_critico;
                return (
                    <span className={`font-bold ${isCritical ? 'text-destructive' : 'text-primary'}`}>
                        {stock}
                    </span>
                );
            },
        },
        {
            accessorKey: 'stock_critico',
            header: 'Nível Crítico',
            cell: ({ row }) => <span className="font-bold text-red-600">{row.original.stock_critico}</span>,
        },
        {
            accessorKey: 'stock_optimo',
            header: 'Nível Óptimo',
            cell: ({ row }) => <span className="font-bold text-green-600">{row.original.stock_optimo}</span>,
        },
        {
            accessorKey: 'alertado',
            header: 'Estado',
            cell: ({ row }) => (
                row.original.alertado ?
                    <Badge variant="destructive" className="gap-1"><Bell className="h-3 w-3" />Disparado</Badge> :
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Normal</Badge>
            ),
        },
        {
            accessorKey: 'ativo',
            header: 'Ativo',
            cell: ({ row }) => (
                row.original.ativo ?
                    <CheckCircle className="h-5 w-5 text-green-500" /> :
                    <XCircle className="h-5 w-5 text-muted-foreground" />
            ),
        },
        {
            id: 'actions',
            header: 'Ações',
            cell: ({ row }) => (
                <Link to={`/admin/stock/alerts/${row.original.id}`}>
                    <Button variant="outline" size="sm">Editar</Button>
                </Link>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Alertas de Stock</h1>
                    <p className="text-muted-foreground">Gerir regras de notificação de stock</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={checkAlertsNow} disabled={loading}>
                        Verificar Agora
                    </Button>
                    <Link to="/admin/stock/alerts/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Alerta
                        </Button>
                    </Link>
                </div>
            </div>

            <DataTable columns={columns} data={alerts} loading={loading} />
        </div>
    );
}
