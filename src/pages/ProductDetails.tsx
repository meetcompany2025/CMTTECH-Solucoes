import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Truck, 
  Shield, 
  ArrowLeft,
  Phone,
  Loader2,
  Play,
  Package,
  Eye,
  Star
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ProductRepository } from "@/data/repositories/product.repository.impl";
import { CategoryRepository } from "@/data/repositories/category.repository.impl";
import { Product } from "@/domain/entities/product.entity";

interface UIProduct {
  id: string;
  name: string;
  sku: string;
  slug: string;
  category: string;
  price: number;
  basePrice: number;
  promotionalPrice?: number;
  cost?: number;
  image: string;
  gallery: string[];
  videoUrl?: string;
  inStock: boolean;
  description?: string;
  fullDescription?: string;
  weight?: number;
  dimensions?: { w?: number; h?: number; d?: number };
  productType: string;
  hasVariants: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  metaTitle?: string;
  metaDescription?: string;
  views: number;
  sales: number;
  rating: number;
  totalReviews: number;
  variants?: Array<{
    id: string;
    sku: string;
    name: string;
    priceAdjust: number;
    stock: number;
    minStock: number;
    image?: string;
    active: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

const mapProductToUI = (product: Product): UIProduct => ({
  id: product.id,
  name: product.nome,
  sku: product.sku,
  slug: product.slug,
  price: product.preco_venda,
  basePrice: product.preco_base,
  promotionalPrice: product.preco_promocional || undefined,
  cost: product.custo || undefined,
  image: product.imagem_principal || '/placeholder-image.jpg',
  gallery: product.imagens_galeria?.filter(img => img && img !== 'string') || [],
  videoUrl: product.video_url || undefined,
  category: product.categoria_id,
  inStock: product.ativo,
  description: product.descricao_curta || undefined,
  fullDescription: product.descricao_completa || undefined,
  weight: product.peso || undefined,
  dimensions: product.dimensoes ? {
    w: product.dimensoes.additionalProp1,
    h: product.dimensoes.additionalProp2,
    d: product.dimensoes.additionalProp3
  } : undefined,
  productType: product.tipo_produto,
  hasVariants: product.tem_variantes,
  isFeatured: product.destaque,
  isNew: product.novidade,
  isBestSeller: product.mais_vendido,
  metaTitle: product.meta_title || undefined,
  metaDescription: product.meta_description || undefined,
  views: (product as any).contador_visualizacoes || 0,
  sales: (product as any).contador_vendas || 0,
  rating: (product as any).avaliacao_media || 0,
  totalReviews: (product as any).total_avaliacoes || 0,
  variants: product.variantes?.map(v => ({
    id: v.id || '',
    sku: v.sku,
    name: v.nome_variante,
    priceAdjust: v.preco_ajuste,
    stock: v.stock_actual,
    minStock: v.stock_minimo,
    image: v.imagem || undefined,
    active: v.activo
  })),
  createdAt: product.created_at,
  updatedAt: product.updated_at,
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [product, setProduct] = useState<UIProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<UIProduct[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'variants'>('description');
  const { addItem } = useCart();
  const { toast } = useToast();

  const productRepository = new ProductRepository();
  const categoryRepository = new CategoryRepository();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const domainProduct = await productRepository.getById(id);
        const uiProduct = mapProductToUI(domainProduct);
        setProduct(uiProduct);

        const relatedResult = await productRepository.getAll({
          categoria_id: domainProduct.categoria_id,
          ativo: true,
          limit: 4,
        });
        const relatedUIProducts = relatedResult.products
          .filter(p => p.id !== id)
          .slice(0, 4)
          .map(mapProductToUI);
        setRelatedProducts(relatedUIProducts);

        const category = await categoryRepository.getById(domainProduct.categoria_id);
        setCategoryName(category.nome);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold mb-4">Produto não encontrado</h1>
        <Link to="/loja"><Button>Voltar à Loja</Button></Link>
      </div>
    );
  }

  const allImages = [product.image, ...product.gallery.filter(img => img !== product.image)];
  const discount = product.basePrice > product.price 
    ? Math.round(((product.basePrice - product.price) / product.basePrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.name.split(' ')[0],
      });
    }
    toast({ title: "Adicionado ao carrinho", description: `${quantity}x ${product.name}` });
  };

  const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-900">Início</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link to="/loja" className="text-gray-500 hover:text-gray-900">Loja</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500">{categoryName}</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-white rounded-lg border overflow-hidden mb-4">
              {showVideo && product.videoUrl ? (
                <div className="aspect-square">
                  <video src={product.videoUrl} controls className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="relative aspect-square">
                  <img src={allImages[selectedImageIndex]} alt={product.name} className="w-full h-full object-contain p-4" />
                  {allImages.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-50">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-50">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedImageIndex(idx); setShowVideo(false); }}
                  className={`shrink-0 w-16 h-16 rounded border-2 bg-white overflow-hidden ${selectedImageIndex === idx && !showVideo ? 'border-gray-900' : 'border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
              {product.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`shrink-0 w-16 h-16 rounded border-2 bg-gray-900 flex items-center justify-center ${showVideo ? 'border-gray-900' : 'border-gray-200'}`}
                >
                  <Play className="h-6 w-6 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {product.isNew && <Badge className="bg-blue-500">Novo</Badge>}
              {product.isFeatured && <Badge className="bg-yellow-500">Destaque</Badge>}
              {product.isBestSeller && <Badge className="bg-orange-500">Mais Vendido</Badge>}
              {discount > 0 && <Badge className="bg-red-500">-{discount}%</Badge>}
            </div>

            <p className="text-sm text-gray-500 mb-1">SKU: {product.sku}</p>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{product.name}</h1>
            
            {product.description && (
              <p className="text-gray-600 mb-4">{product.description}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {discount > 0 && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.basePrice)}</span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              {product.inStock ? (
                <span className="flex items-center gap-1 text-green-600 text-sm"><Check className="h-4 w-4" /> Em stock</span>
              ) : (
                <span className="text-red-600 text-sm">Indisponível</span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-3 mb-6">
              <div className="flex items-center border rounded">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-50">−</button>
                <span className="px-4 py-2 border-x min-w-[50px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-50">+</button>
              </div>
              <Button onClick={handleAddToCart} disabled={!product.inStock} className="flex-1 bg-gray-900 hover:bg-gray-800">
                <ShoppingCart className="h-4 w-4 mr-2" /> Adicionar ao Carrinho
              </Button>
            </div>

            {/* WhatsApp */}
            <a href="https://wa.me/244942546887" target="_blank" rel="noopener noreferrer" className="block mb-6">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Phone className="h-4 w-4 mr-2" /> Pedir Orçamento via WhatsApp
              </Button>
            </a>

            {/* Product Details Table */}
            <div className="bg-white rounded-lg border p-4 mb-6">
              <h3 className="font-medium mb-3">Detalhes do Produto</h3>
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  <tr><td className="py-2 text-gray-500">SKU</td><td className="py-2 text-right font-medium">{product.sku}</td></tr>
                  <tr><td className="py-2 text-gray-500">Categoria</td><td className="py-2 text-right font-medium">{categoryName}</td></tr>
                  <tr><td className="py-2 text-gray-500">Tipo</td><td className="py-2 text-right font-medium capitalize">{product.productType}</td></tr>
                  {product.weight && <tr><td className="py-2 text-gray-500">Peso</td><td className="py-2 text-right font-medium">{product.weight} kg</td></tr>}
                  {product.dimensions && (product.dimensions.w || product.dimensions.h || product.dimensions.d) && (
                    <tr>
                      <td className="py-2 text-gray-500">Dimensões</td>
                      <td className="py-2 text-right font-medium">
                        {[product.dimensions.w, product.dimensions.h, product.dimensions.d].filter(v => v).join(' × ')} cm
                      </td>
                    </tr>
                  )}
                  <tr><td className="py-2 text-gray-500">Preço Base</td><td className="py-2 text-right font-medium">{formatPrice(product.basePrice)}</td></tr>
                  <tr><td className="py-2 text-gray-500">Preço de Venda</td><td className="py-2 text-right font-medium">{formatPrice(product.price)}</td></tr>
                  {product.views > 0 && <tr><td className="py-2 text-gray-500">Visualizações</td><td className="py-2 text-right font-medium">{product.views}</td></tr>}
                  {product.sales > 0 && <tr><td className="py-2 text-gray-500">Vendas</td><td className="py-2 text-right font-medium">{product.sales}</td></tr>}
                  {product.rating > 0 && (
                    <tr>
                      <td className="py-2 text-gray-500">Avaliação</td>
                      <td className="py-2 text-right font-medium flex items-center justify-end gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {product.rating.toFixed(1)} ({product.totalReviews})
                      </td>
                    </tr>
                  )}
                  <tr><td className="py-2 text-gray-500">Adicionado em</td><td className="py-2 text-right font-medium">{formatDate(product.createdAt)}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Truck className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium">Entrega Rápida</p>
                  <p className="text-xs text-gray-500">Todo o país</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Shield className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium">Garantia</p>
                  <p className="text-xs text-gray-500">100% Original</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="border-b mb-6">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-3 text-sm font-medium border-b-2 -mb-px ${activeTab === 'description' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500'}`}
              >
                Descrição
              </button>
              {product.variants && product.variants.length > 0 && (
                <button
                  onClick={() => setActiveTab('variants')}
                  className={`pb-3 text-sm font-medium border-b-2 -mb-px ${activeTab === 'variants' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500'}`}
                >
                  Variantes ({product.variants.length})
                </button>
              )}
            </div>
          </div>

          {activeTab === 'description' && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-4">Descrição Completa</h3>
              {product.fullDescription ? (
                <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.fullDescription }} />
              ) : product.description ? (
                <p className="text-gray-600">{product.description}</p>
              ) : (
                <p className="text-gray-500">Sem descrição disponível.</p>
              )}
            </div>
          )}

          {activeTab === 'variants' && product.variants && (
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-medium">Variante</th>
                    <th className="text-left p-3 font-medium">SKU</th>
                    <th className="text-right p-3 font-medium">Ajuste Preço</th>
                    <th className="text-right p-3 font-medium">Stock</th>
                    <th className="text-center p-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {product.variants.map((v) => (
                    <tr key={v.id}>
                      <td className="p-3">{v.name}</td>
                      <td className="p-3 text-gray-500">{v.sku}</td>
                      <td className="p-3 text-right">{v.priceAdjust > 0 ? `+${formatPrice(v.priceAdjust)}` : formatPrice(v.priceAdjust)}</td>
                      <td className="p-3 text-right">{v.stock}</td>
                      <td className="p-3 text-center">
                        <span className={`text-xs px-2 py-1 rounded ${v.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {v.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Produtos Relacionados</h2>
              <Link to="/loja" className="text-sm text-gray-600 hover:text-gray-900">Ver todos →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/produto/${p.id}`} className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-50 p-3">
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-400 mb-1">{p.sku}</p>
                    <h3 className="text-sm font-medium line-clamp-2 mb-2 min-h-[40px]">{p.name}</h3>
                    <span className="font-semibold">{formatPrice(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
