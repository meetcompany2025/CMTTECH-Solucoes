import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { toast } from 'sonner';
import { CategoryRepository } from '@/data/repositories/category.repository.impl';
import { Category } from '@/domain/entities/category.entity';

const categoryRepository = new CategoryRepository();

export default function CategoriesList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryRepository.getAll();
            setCategories(data.sort((a, b) => a.ordem - b.ordem));
        } catch (error) {
            toast.error('Falha ao carregar categorias');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;

        try {
            await categoryRepository.delete(categoryToDelete.id);
            toast.success('Categoria eliminada com sucesso');
            loadCategories();
        } catch (error) {
            toast.error('Falha ao eliminar categoria');
        } finally {
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
        }
    };

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'nome',
            header: 'Nome',
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
        },
        {
            accessorKey: 'ordem',
            header: 'Ordem',
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
                    <Link to={`/admin/categories/${row.original.id}/edit`}>
                        <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setCategoryToDelete(row.original);
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
                    <h1 className="text-3xl font-bold">Categorias</h1>
                    <p className="text-muted-foreground">Gerir categorias de produtos</p>
                </div>
                <Link to="/admin/categories/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Categoria
                    </Button>
                </Link>
            </div>

            <DataTable columns={columns} data={categories} loading={loading} />

            <ConfirmDialog
                open={deleteDialogOpen}
                onConfirm={handleDelete}
                onCancel={() => {
                    setDeleteDialogOpen(false);
                    setCategoryToDelete(null);
                }}
                title="Eliminar Categoria"
                description={`Tem a certeza que pretende eliminar a categoria "${categoryToDelete?.nome}"? Esta ação não pode ser revertida.`}
                confirmText="Eliminar"
                variant="danger"
            />
        </div>
    );
}
