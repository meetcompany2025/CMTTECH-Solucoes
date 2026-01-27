import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { ProductRepository } from '@/data/repositories/product.repository.impl';
import { CategoryRepository } from '@/data/repositories/category.repository.impl';
import { StockRepositoryImpl } from '@/data/repositories/stock.repository.impl';
import { StockDataSource } from '@/data/datasources/stock.datasource';
import { ProductCreate, ProductUpdate, ProductVariant } from '@/domain/entities/product.entity';
import { Category } from '@/domain/entities/category.entity';
import { ImageUpload } from '@/components/admin/image-upload';
import { Plus, Trash2, Video } from 'lucide-react';

const productRepository = new ProductRepository();
const categoryRepository = new CategoryRepository();
const stockRepository = new StockRepositoryImpl(new StockDataSource());

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const isEditing = !!id;

    // Media State
    const [mainImageFile, setMainImageFile] = useState<File[]>([]);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [videoFile, setVideoFile] = useState<File[]>([]);
    const [currentMainImage, setCurrentMainImage] = useState<string | null>(null);
    const [currentGalleryImages, setCurrentGalleryImages] = useState<string[]>([]);
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

    // Stock tracking to detect changes
    const [initialStock, setInitialStock] = useState<number | null>(null);
    const [initialVariantsStock, setInitialVariantsStock] = useState<Record<string, number>>({});

    const form = useForm<ProductCreate>({
        defaultValues: {
            nome: '',
            sku: '',
            slug: '',
            categoria_id: '',
            preco_base: 0,
            preco_venda: 0,
            custo: 0,
            descricao_curta: '',
            descricao_completa: '',
            tipo_produto: 'simples',
            peso: 0,
            dimensoes: {
                comprimento: 0,
                largura: 0,
                altura: 0
            },
            video_url: '',
            tem_variantes: false,
            activo: true,
            destaque: false,
            novidade: false,
            mais_vendido: false,
            meta_title: '',
            meta_description: '',
            meta_keywords: '',
            variantes: [],
            // Backward compatibility fields
            stock_quantidade: 0,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "variantes"
    });

    // Auto-generate slug from name
    const nome = form.watch('nome');
    useEffect(() => {
        if (!isEditing && nome) {
            const generatedSlug = nome
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-0\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            form.setValue('slug', generatedSlug);
        }
    }, [nome, form, isEditing]);

    useEffect(() => {
        loadCategories();
        if (isEditing && id) {
            loadProduct(id);
        }
    }, [id, isEditing]);

    const loadCategories = async () => {
        try {
            const data = await categoryRepository.getAll();
            setCategories(data.filter((c) => c.ativo));
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const loadProduct = async (productId: string) => {
        try {
            const product = await productRepository.getById(productId);
            form.reset({
                nome: product.nome,
                sku: product.sku,
                slug: product.slug,
                categoria_id: product.categoria_id,
                preco_base: product.preco_base,
                preco_venda: product.preco_venda,
                custo: product.custo || 0,
                descricao_curta: product.descricao_curta || '',
                descricao_completa: product.descricao_completa || '',
                tipo_produto: product.tipo_produto || 'simples',
                peso: product.peso || 0,
                dimensoes: (product.dimensoes as any) || { comprimento: 0, largura: 0, altura: 0 },
                video_url: product.video_url || '',
                tem_variantes: product.tem_variantes || false,
                activo: product.ativo,
                destaque: product.destaque,
                novidade: product.novidade || false,
                mais_vendido: product.mais_vendido || false,
                meta_title: product.meta_title || '',
                meta_description: product.meta_description || '',
                meta_keywords: product.meta_keywords || '',
                variantes: product.variantes || [],
                stock_quantidade: product.stock_quantidade,
                marca: product.marca || '',
            });

            setInitialStock(product.stock_quantidade);
            const variantStockMap: Record<string, number> = {};
            product.variantes?.forEach(v => {
                if (v.id) variantStockMap[v.id] = v.stock_actual;
            });
            setInitialVariantsStock(variantStockMap);

            if (product.imagem_principal) setCurrentMainImage(product.imagem_principal);
            if (product.imagens_galeria) setCurrentGalleryImages(product.imagens_galeria);
            if (product.video_url) setCurrentVideoUrl(product.video_url);

        } catch (error) {
            toast.error('Falha ao carregar produto');
            navigate('/admin/products');
        }
    };

    const onSubmit = async (data: ProductCreate | ProductUpdate) => {
        try {
            setLoading(true);
            let productId = id;

            // Prepare data
            const submitData = {
                ...data,
                // Ensure correct field names for API
                activo: data.activo ?? (data as any).ativo
            };

            if (isEditing) {
                (submitData as ProductUpdate).imagem_principal = currentMainImage;
                (submitData as ProductUpdate).imagens_galeria = currentGalleryImages;
            }

            if (isEditing && id) {
                await productRepository.update(id, submitData as ProductUpdate);
            } else {
                const newProduct = await productRepository.create(submitData as ProductCreate);
                productId = newProduct.id;
            }

            // Handle Stock Updates (Adjustments)
            if (productId && isEditing) {
                // Check main stock
                if (initialStock !== null && data.stock_quantidade !== initialStock) {
                    await stockRepository.adjustStock({
                        produto_id: productId,
                        quantidade_nova: data.stock_quantidade || 0,
                        motivo: 'ajuste_manual_form',
                        notas: 'Ajuste via formulário de edição de produto'
                    });
                }

                // Check variant stock
                if (data.variantes) {
                    for (const variant of data.variantes) {
                        if (variant.id && initialVariantsStock[variant.id] !== undefined) {
                            if (variant.stock_actual !== initialVariantsStock[variant.id]) {
                                await stockRepository.adjustStock({
                                    produto_id: productId,
                                    variante_id: variant.id,
                                    quantidade_nova: variant.stock_actual,
                                    motivo: 'ajuste_manual_form',
                                    notas: 'Ajuste via formulário de edição de produto'
                                });
                            }
                        }
                    }
                }
            }

            // Handle Image Uploads
            // Handle Media Uploads
            if (productId) {
                const uploadPromises = [];
                // Use supabase by default as requested by user's curl
                const USE_SUPABASE = true;

                if (mainImageFile.length > 0) {
                    uploadPromises.push(productRepository.uploadMainImage(productId, mainImageFile[0], USE_SUPABASE));
                }
                if (galleryFiles.length > 0) {
                    uploadPromises.push(productRepository.uploadGalleryImages(productId, galleryFiles, USE_SUPABASE));
                }
                if (videoFile.length > 0) {
                    uploadPromises.push(productRepository.uploadVideo(productId, videoFile[0], USE_SUPABASE));
                }

                if (uploadPromises.length > 0) {
                    await Promise.all(uploadPromises);
                }
            }

            toast.success(`Produto ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
            navigate('/admin/products');
        } catch (error: any) {
            console.error(error);
            const message = error?.response?.data?.message || `Falha ao ${isEditing ? 'atualizar' : 'criar'} produto`;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const temVariantes = form.watch('tem_variantes');

    return (
        <div className="max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        {isEditing ? 'Editar Produto' : 'Novo Produto'}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditing ? 'Atualizar informações do produto' : 'Adicionar novo produto ao catálogo'}
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => navigate('/admin/products')}>
                        Cancelar
                    </Button>
                    <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={loading}>
                        {loading ? 'A guardar...' : isEditing ? 'Atualizar' : 'Criar'}
                    </Button>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Tabs defaultValue="geral" className="w-full">
                        <TabsList className="grid grid-cols-5 w-full">
                            <TabsTrigger value="geral">Geral</TabsTrigger>
                            <TabsTrigger value="precos">Preços e Stock</TabsTrigger>
                            <TabsTrigger value="media">Media</TabsTrigger>
                            <TabsTrigger value="seo">SEO</TabsTrigger>
                            <TabsTrigger value="variantes" disabled={!temVariantes}>Variantes</TabsTrigger>
                        </TabsList>

                        {/* General Tab */}
                        <TabsContent value="geral" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informação Básica</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="nome"
                                            rules={{ required: 'Nome é obrigatório' }}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nome *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="ex: Smartphone XYZ" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="categoria_id"
                                            rules={{ required: 'Categoria é obrigatória' }}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Categoria *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecionar categoria" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {categories.map((category) => (
                                                                <SelectItem key={category.id} value={category.id}>
                                                                    {category.nome}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="sku"
                                            rules={{ required: 'SKU é obrigatório' }}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SKU *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="ex: PROD-001" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="slug"
                                            rules={{ required: 'Slug é obrigatório' }}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Slug (URL) *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="ex: nome-do-produto" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="descricao_curta"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descrição Curta</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Breve resumo para listagens"
                                                        rows={2}
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
                                        name="descricao_completa"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descrição Detalhada</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Venda o seu produto com detalhes técnicos e benefícios"
                                                        rows={6}
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Configurações Visuais e Estado</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="tipo_produto"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tipo de Produto</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Tipo" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="simples">Simples</SelectItem>
                                                            <SelectItem value="variavel">Variável (com opções)</SelectItem>
                                                            <SelectItem value="digital">Digital</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="destaque"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-md border p-3">
                                                        <FormLabel className="text-sm">Destaque</FormLabel>
                                                        <FormControl>
                                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="novidade"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-md border p-3">
                                                        <FormLabel className="text-sm">Novidade</FormLabel>
                                                        <FormControl>
                                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="mais_vendido"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-md border p-3">
                                                        <FormLabel className="text-sm">Top Vendas</FormLabel>
                                                        <FormControl>
                                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="activo"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-md border p-3 border-primary/20 bg-primary/5">
                                                        <FormLabel className="text-sm font-bold">Activo</FormLabel>
                                                        <FormControl>
                                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Pricing and Stock Tab */}
                        <TabsContent value="precos" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Financeiro</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-6 md:grid-cols-3">
                                        <FormField
                                            control={form.control}
                                            name="preco_base"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Preço Base (AOA)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="preco_venda"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Preço Venda (AOA)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="custo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Preço de Custo</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Logística e Dimensões</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="stock_quantidade"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quantidade em Stock</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="peso"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Peso (kg)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        <FormField
                                            control={form.control}
                                            name="dimensoes.comprimento"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Comprimento (cm)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="dimensoes.largura"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Largura (cm)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="dimensoes.altura"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Altura (cm)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Media Tab */}
                        <TabsContent value="media" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Imagens do Produto</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <ImageUpload
                                            label="Imagem Principal"
                                            description="Formatos suportados: JPG, PNG, WEBP (Máx. 5MB)"
                                            maxFiles={1}
                                            files={mainImageFile}
                                            onFilesChange={setMainImageFile}
                                            existingUrls={currentMainImage ? [currentMainImage] : []}
                                            onRemoveExisting={() => setCurrentMainImage(null)}
                                        />

                                        <ImageUpload
                                            label="Galeria"
                                            description="Até 5 fotos adicionais"
                                            maxFiles={5}
                                            files={galleryFiles}
                                            onFilesChange={setGalleryFiles}
                                            existingUrls={currentGalleryImages}
                                            onRemoveExisting={(url) => setCurrentGalleryImages(prev => prev.filter(u => u !== url))}
                                        />
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="video_url"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Video className="w-4 h-4" /> Link do Vídeo (YouTube/Vimeo)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://..." {...field} value={field.value || ''} />
                                                    </FormControl>
                                                    <FormDescription>Se preferir usar um vídeo externo</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <ImageUpload
                                            label="Upload de Vídeo"
                                            description="Formatos: MP4, WebM (Máx. 20MB)"
                                            maxFiles={1}
                                            files={videoFile}
                                            onFilesChange={setVideoFile}
                                            existingUrls={currentVideoUrl ? [currentVideoUrl] : []}
                                            onRemoveExisting={() => setCurrentVideoUrl(null)}
                                            accept={{ 'video/*': ['.mp4', '.webm'] }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* SEO Tab */}
                        <TabsContent value="seo" className="space-y-6 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Optimização SEO</CardTitle>
                                    <CardDescription>Configure como o produto aparece nos motores de busca</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="meta_title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Meta Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Título para o Google" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="meta_description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Meta Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Breve descrição para o Google" rows={3} {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="meta_keywords"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Keywords (separadas por vírgula)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="smartphone, tecnologia, ..." {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Variants Tab */}
                        <TabsContent value="variantes" className="space-y-6 mt-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Configurar Variantes</h3>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => append({
                                        sku: `${form.getValues('sku')}-V${fields.length + 1}`,
                                        nome_variante: '',
                                        opcoes: {},
                                        preco_ajuste: 0,
                                        stock_actual: 0,
                                        stock_minimo: 0,
                                        activo: true
                                    })}
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Adicionar Variante
                                </Button>
                            </div>

                            {fields.map((item, index) => (
                                <Card key={item.id}>
                                    <CardContent className="pt-6">
                                        <div className="grid gap-4 md:grid-cols-4 items-end">
                                            <FormField
                                                control={form.control}
                                                name={`variantes.${index}.nome_variante`}
                                                render={({ field }) => (
                                                    <FormItem className="col-span-2">
                                                        <FormLabel>Nome da Variante (ex: Cor: Azul, Tam: L)</FormLabel>
                                                        <Input {...field} />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`variantes.${index}.sku`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>SKU Específico</FormLabel>
                                                        <Input {...field} />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex justify-end">
                                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name={`variantes.${index}.preco_ajuste`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Ajuste de Preço</FormLabel>
                                                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`variantes.${index}.stock_actual`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Stock Atual</FormLabel>
                                                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`variantes.${index}.stock_minimo`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Stock Mínimo</FormLabel>
                                                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`variantes.${index}.activo`}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center gap-2 border rounded-md p-2 h-10 mt-auto">
                                                        <FormLabel className="mb-0 text-xs">Activo</FormLabel>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>
                    </Tabs>

                    <Card>
                        <CardContent className="pt-6">
                            <FormField
                                control={form.control}
                                name="tem_variantes"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base font-bold">Gerir Variantes</FormLabel>
                                            <FormDescription>Ative para adicionar opções como cor, tamanho, etc.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex gap-4 pt-4 border-t">
                        <Button type="submit" disabled={loading} className="w-full md:w-auto">
                            {loading ? 'A guardar...' : isEditing ? 'Atualizar Produto' : 'Criar Produto'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/products')} className="w-full md:w-auto">
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

