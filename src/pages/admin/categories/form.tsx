import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { CategoryRepository } from '@/data/repositories/category.repository.impl';
import { CategoryCreate, CategoryUpdate } from '@/domain/entities/category.entity';

const categoryRepository = new CategoryRepository();

export default function CategoryForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const isEditing = !!id;

    const form = useForm<CategoryCreate>({
        defaultValues: {
            nome: '',
            descricao: '',
            slug: '',
            ordem: 0,
            ativo: true,
        },
    });

    useEffect(() => {
        if (isEditing && id) {
            loadCategory(id);
        }
    }, [id, isEditing]);

    const loadCategory = async (categoryId: string) => {
        try {
            const category = await categoryRepository.getById(categoryId);
            form.reset(category);
        } catch (error) {
            toast.error('Falha ao carregar categoria');
            navigate('/admin/categories');
        }
    };

    const onSubmit = async (data: CategoryCreate | CategoryUpdate) => {
        try {
            setLoading(true);

            if (isEditing && id) {
                await categoryRepository.update(id, data);
                toast.success('Categoria atualizada com sucesso');
            } else {
                await categoryRepository.create(data as CategoryCreate);
                toast.success('Categoria criada com sucesso');
            }

            navigate('/admin/categories');
        } catch (error: any) {
            const message = error?.response?.data?.message || `Falha ao ${isEditing ? 'atualizar' : 'criar'} categoria`;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
                </h1>
                <p className="text-muted-foreground">
                    {isEditing ? 'Atualizar informações da categoria' : 'Criar nova categoria de produtos'}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="nome"
                        rules={{ required: 'Nome é obrigatório' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome *</FormLabel>
                                <FormControl>
                                    <Input placeholder="ex: Eletr ónicos" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="descricao"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descrição</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Descrição da categoria"
                                        rows={3}
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="eletronicos (deixe vazio para gerar automaticamente)"
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormDescription>
                                    URL amigável para a categoria. Será gerado automaticamente se deixado em branco.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ordem"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ordem</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Ordem de exibição da categoria (menor número aparece primeiro)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ativo"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Ativo</FormLabel>
                                    <FormDescription>
                                        Categoria visível no site
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'A guardar...' : isEditing ? 'Atualizar' : 'Criar'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/admin/categories')}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
