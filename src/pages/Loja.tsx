import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { products, categories, formatPrice } from "@/data/products";

export default function Loja() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart();
  const { toast } = useToast();

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
    });
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient py-20">
        <div className="container-padding mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-background mb-4">
            Loja Online
          </h1>
          <p className="text-lg text-background/80 max-w-2xl mx-auto">
            Equipamentos de qualidade para telecomunicações, redes, segurança e energia solar.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Pesquisar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover-lift">
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded">
                    {product.brand}
                  </span>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-secondary">{formatPrice(product.price)}</span>
                    {product.inStock && (
                      <span className="text-xs text-green-600 font-medium">Em Stock</span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Link to={`/produto/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Nenhum produto encontrado.</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 p-8 bg-muted rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Não encontrou o que procura?
            </h3>
            <p className="text-muted-foreground mb-6">
              Entre em contacto connosco para um orçamento personalizado.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contactos">
                <Button variant="secondary" size="lg">
                  Pedir Orçamento
                </Button>
              </Link>
              <a href="https://wa.me/244942546887" target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="lg">
                  Contactar via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
