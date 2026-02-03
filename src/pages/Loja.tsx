import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Loader2, Grid3x3, LayoutList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ProductRepository } from "@/data/repositories/product.repository.impl";
import { CategoryRepository } from "@/data/repositories/category.repository.impl";
import { Product, ProductSearchParams } from "@/domain/entities/product.entity";
import { Category } from "@/domain/entities/category.entity";

interface UIProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  inStock: boolean;
  description?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

interface UICategory {
  id: string;
  name: string;
}

const mapProductToUI = (product: Product): UIProduct => ({
  id: product.id,
  name: product.nome,
  sku: product.sku,
  price: product.preco_venda,
  originalPrice: product.preco_base,
  image: product.imagem_principal || '/placeholder-image.jpg',
  category: product.categoria_id,
  inStock: product.ativo,
  description: product.descricao_curta || undefined,
  isNew: product.novidade,
  isFeatured: product.destaque,
  isBestSeller: product.mais_vendido,
});

const mapCategoryToUI = (category: Category): UICategory => ({
  id: category.id,
  name: category.nome,
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(price);
};

const getDiscount = (original: number, sale: number) => {
  return original > sale ? Math.round(((original - sale) / original) * 100) : 0;
};

export default function Loja() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [allProducts, setAllProducts] = useState<UIProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<UIProduct[]>([]);
  const [categories, setCategories] = useState<UICategory[]>([{ id: "all", name: "Todos" }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const { toast } = useToast();

  const productRepository = new ProductRepository();
  const categoryRepository = new CategoryRepository();

  // Fetch all categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryRepository.getAll();
        const uiCategories = data.filter(cat => cat.ativo).map(mapCategoryToUI);
        setCategories([{ id: "all", name: "Todos" }, ...uiCategories]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch all products once on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await productRepository.getAll({ ativo: true, limit: 500 });
        const uiProducts = result.products.map(mapProductToUI);
        setAllProducts(uiProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Erro ao carregar produtos');
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Client-side filtering and sorting
  useEffect(() => {
    let result = [...allProducts];

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter(p => p.category === activeCategory);
    }

    // Filter by search query (client-side)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name-asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": result.sort((a, b) => b.name.localeCompare(a.name)); break;
    }

    setFilteredProducts(result);
  }, [allProducts, activeCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: UIProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.name.split(' ')[0],
    });
    toast({ title: "Adicionado ao carrinho", description: product.name });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold text-gray-900">Loja</h1>
          <p className="text-gray-500 mt-1">Equipamentos de telecomunicações, redes e energia solar</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={activeCategory} onValueChange={setActiveCategory}>
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="price-asc">Menor preço</SelectItem>
                <SelectItem value="price-desc">Maior preço</SelectItem>
                <SelectItem value="name-asc">A-Z</SelectItem>
                <SelectItem value="name-desc">Z-A</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 ${viewMode === "grid" ? "bg-gray-900 text-white" : "hover:bg-gray-100"}`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 ${viewMode === "list" ? "bg-gray-900 text-white" : "hover:bg-gray-100"}`}
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {!loading && (
          <p className="text-sm text-gray-500 mb-4">{filteredProducts.length} produtos</p>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Nenhum produto encontrado</p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}>
              Limpar filtros
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => {
              const discount = getDiscount(product.originalPrice, product.price);
              return (
                <Link key={product.id} to={`/produto/${product.id}`} className="group">
                  <div className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-square bg-gray-50 p-3">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {discount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">-{discount}%</span>
                        )}
                        {product.isNew && (
                          <span className="bg-blue-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">Novo</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-gray-400 mb-0.5">{product.sku}</p>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] mb-2">{product.name}</h3>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-gray-900">{formatPrice(product.price)}</span>
                        {discount > 0 && (
                          <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <p className={`text-[10px] mt-1 ${product.inStock ? "text-green-600" : "text-red-500"}`}>
                        {product.inStock ? "Em stock" : "Indisponível"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const discount = getDiscount(product.originalPrice, product.price);
              return (
                <Link key={product.id} to={`/produto/${product.id}`}>
                  <div className="flex bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                    <div className="w-32 h-32 shrink-0 bg-gray-50 p-2 relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      {discount > 0 && (
                        <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">-{discount}%</span>
                      )}
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400">{product.sku}</span>
                          {product.isNew && <Badge className="text-[10px] h-4">Novo</Badge>}
                        </div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        {product.description && <p className="text-sm text-gray-500 line-clamp-1 mt-1">{product.description}</p>}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
                          {discount > 0 && <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs ${product.inStock ? "text-green-600" : "text-red-500"}`}>
                            {product.inStock ? "Em stock" : "Indisponível"}
                          </span>
                          <Button size="sm" onClick={(e) => handleAddToCart(product, e)} className="bg-gray-900 hover:bg-gray-800">
                            <ShoppingCart className="h-4 w-4 mr-1" /> Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gray-900 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Não encontrou o que procura?</h3>
          <p className="text-gray-400 mb-6">Contacte-nos para um orçamento personalizado</p>
          <div className="flex justify-center gap-3">
            <Link to="/contactos">
              <Button variant="secondary">Pedir Orçamento</Button>
            </Link>
            <a href="https://wa.me/244942546887" target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-600 hover:bg-green-700">WhatsApp</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
