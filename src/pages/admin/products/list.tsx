import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { toast } from 'sonner';
import { ProductRepository } from '@/data/repositories/product.repository.impl';
import { Product } from '@/domain/entities/product.entity';

const productRepository = new ProductRepository();

export default function ProductsList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productRepository.getAll({ limit: 1000 });
            setProducts(data.products);
        } catch (error) {
            toast.error('Falha ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!productToDelete) return;

        try {
            await productRepository.delete(productToDelete.id);
            toast.success('Produto eliminado com sucesso');
            loadProducts();
        } catch (error) {
            toast.error('Falha ao eliminar produto');
        } finally {
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);

    const filteredProducts = products.filter((product) =>
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'imagem_principal',
            header: 'Imagem',
            cell: ({ row }) => (
                row.original.imagem_principal ? (
                    <img
                        src={row.original.imagem_principal}
                        alt={row.original.nome}
                        className="w-12 h-12 rounded object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-xs">
                        N/A
                    </div>
                )
            ),
        },
        {
            accessorKey: 'nome',
            header: 'Nome',
        },
        {
            accessorKey: 'sku',
            header: 'SKU',
        },
        {
            accessorKey: 'preco_venda',
            header: 'Preço',
            cell: ({ row }) => formatCurrency(row.original.preco_venda),
        },
        {
            accessorKey: 'stock_quantidade',
            header: 'Stock',
            cell: ({ row }) => {
                const stock = row.original.stock_quantidade;
                return (
                    <span
                        className={`font-medium ${stock === 0
                            ? 'text-destructive'
                            : stock < 10
                                ? 'text-orange-600'
                                : 'text-green-600'
                            }`}
                    >
                        {stock}
                    </span>
                );
            },
        },
        {
            accessorKey: 'ativo',
            header: 'Status',
            cell: ({ row }) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${row.original.ativo
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}
                >
                    {row.original.ativo ? 'Ativo' : 'Inativo'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Ações',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Link to={`/admin/products/${row.original.id}/edit`}>
                        <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setProductToDelete(row.original);
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Produtos</h1>
                    <p className="text-muted-foreground">Gerir catálogo de produtos</p>
                </div>
                <Link to="/admin/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Produto
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Pesquisar por nome ou SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <DataTable columns={columns} data={filteredProducts} loading={loading} pageSize={20} />

            <ConfirmDialog
                open={deleteDialogOpen}
                onConfirm={handleDelete}
                onCancel={() => {
                    setDeleteDialogOpen(false);
                    setProductToDelete(null);
                }}
                title="Eliminar Produto"
                description={`Tem a certeza que pretende eliminar o produto "${productToDelete?.nome}"? Esta ação não pode ser revertida.`}
                confirmText="Eliminar"
                variant="danger"
            />
        </div>
    );
}
