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
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { StockAlertRepository } from '@/data/repositories/stock-alert.repository.impl';
import { ProductRepository } from '@/data/repositories/product.repository.impl';
import { StockAlertCreate, StockAlertUpdate } from '@/domain/entities/stock-alert.entity';
import { Product } from '@/domain/entities/product.entity';

const stockAlertRepository = new StockAlertRepository();
const productRepository = new ProductRepository();

export default function StockAlertForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const isEditing = !!id;

    const form = useForm<StockAlertCreate>({
        defaultValues: {
            product_id: '',
            stock_critico: 5,
            stock_optimo: 10,
            ativo: true,
        },
    });

    useEffect(() => {
        loadProducts();
        if (isEditing && id) {
            loadAlert(id);
        }
    }, [id, isEditing]);

    const loadProducts = async () => {
        try {
            const data = await productRepository.getAll({ limit: 1000 });
            setProducts(data.products);
        } catch (error) {
            console.error('Failed to load products:', error);
            toast.error('Falha ao carregar produtos');
        }
    };

    const loadAlert = async (alertId: string) => {
        try {
            const alert = await stockAlertRepository.getById(alertId);
            form.reset({
                product_id: alert.product_id,
                variant_id: alert.variant_id,
                stock_critico: alert.stock_critico,
                stock_optimo: alert.stock_optimo,
                ativo: alert.ativo,
            });
        } catch (error) {
            toast.error('Falha ao carregar alerta');
            navigate('/admin/stock/alerts');
        }
    };

    const onSubmit = async (data: StockAlertCreate | StockAlertUpdate) => {
        try {
            setLoading(true);

            if (isEditing && id) {
                await stockAlertRepository.update(id, data as StockAlertUpdate);
                toast.success('Alerta atualizado com sucesso');
            } else {
                await stockAlertRepository.create(data as StockAlertCreate);
                toast.success('Alerta criado com sucesso');
            }

            navigate('/admin/stock/alerts');
        } catch (error: any) {
            const message = error?.response?.data?.message || `Falha ao ${isEditing ? 'atualizar' : 'criar'} alerta`;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    {isEditing ? 'Editar Alerta' : 'Novo Alerta'}
                </h1>
                <p className="text-muted-foreground">
                    configurar regras de monitorização de stock
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <FormField
                        control={form.control}
                        name="product_id"
                        rules={{ required: 'Produto é obrigatório' }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Produto</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecionar produto" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={product.id}>
                                                {product.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    {isEditing ? 'O produto não pode ser alterado após criação.' : 'Escolha o produto para monitorizar'}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="stock_critico"
                            rules={{ required: true, min: 0 }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock Crítico</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormDescription>Alerta quando igual ou menor que</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="stock_optimo"
                            rules={{ required: true, min: 0 }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock Óptimo</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormDescription>Nível ideal de inventário</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="ativo"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Ativo</FormLabel>
                                    <FormDescription>Monitorização ativada</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'A guardar...' : isEditing ? 'Atualizar' : 'Criar'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/stock/alerts')}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
