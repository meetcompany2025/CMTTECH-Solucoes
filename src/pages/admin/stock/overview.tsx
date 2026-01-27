import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, TrendingDown, Bell } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/data-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { ProductRepository } from '@/data/repositories/product.repository.impl';
import { Product } from '@/domain/entities/product.entity';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const productRepository = new ProductRepository();

export default function StockOverview() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStockParams();
    }, []);

    const loadStockParams = async () => {
        try {
            setLoading(true);
            const data = await productRepository.getAll({ limit: 1000 });
            setProducts(data.products);
        } catch (error) {
            toast.error('Falha ao carregar dados de stock');
        } finally {
            setLoading(false);
        }
    };

    const lowStockProducts = products.filter(p => p.stock_quantidade <= 5);
    const outOfStockProducts = products.filter(p => p.stock_quantidade === 0);

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'nome',
            header: 'Produto',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {row.original.imagem_principal && (
                        <img
                            src={row.original.imagem_principal}
                            alt=""
                            className="h-8 w-8 rounded object-cover"
                        />
                    )}
                    <span className="font-medium">{row.original.nome}</span>
                </div>
            ),
        },
        {
            accessorKey: 'sku',
            header: 'SKU',
        },
        {
            accessorKey: 'stock_quantidade',
            header: 'Quantidade',
            cell: ({ row }) => <span className="font-bold">{row.original.stock_quantidade}</span>,
        },
        {
            id: 'status',
            header: 'Estado',
            cell: ({ row }) => {
                const stock = row.original.stock_quantidade;
                let status: 'disponivel' | 'baixo' | 'sem_stock' = 'disponivel';
                if (stock === 0) status = 'sem_stock';
                else if (stock <= 5) status = 'baixo';

                return <StatusBadge status={status} variant="stock" />;
            },
        },
        {
            id: 'actions',
            header: 'Ações',
            cell: ({ row }) => (
                <Link to={`/admin/products/${row.original.id}/edit`}>
                    <Button variant="outline" size="sm">Atualizar</Button>
                </Link>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Gestão de Stock</h1>
                    <p className="text-muted-foreground">Monitorização e atualização de inventário</p>
                </div>
                <Link to="/admin/stock/alerts">
                    <Button variant="outline">
                        <Bell className="mr-2 h-4 w-4" />
                        Configurar Alertas
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Produtos em Baixo Stock</CardTitle>
                        <TrendingDown className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockProducts.length - outOfStockProducts.length}</div>
                        <p className="text-xs text-muted-foreground">Necessitam atenção</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Esgotados</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{outOfStockProducts.length}</div>
                        <p className="text-xs text-muted-foreground">Sem disponibilidade</p>
                    </CardContent>
                </Card>
            </div>

            <DataTable columns={columns} data={products} loading={loading} />
        </div>
    );
}
