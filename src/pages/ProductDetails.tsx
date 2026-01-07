import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Truck, 
  Shield, 
  ArrowLeft,
  Phone
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { getProductById, getRelatedProducts, formatPrice, categories } from "@/data/products";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const product = getProductById(Number(id));

  if (!product) {
    return (
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Produto não encontrado</h1>
          <Link to="/loja">
            <Button variant="secondary">Voltar à Loja</Button>
          </Link>
        </div>
      </section>
    );
  }

  const relatedProducts = getRelatedProducts(product);
  const gallery = product.gallery || [product.image];
  const categoryName = categories.find((c) => c.id === product.category)?.name || product.category;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
      });
    }
    toast({
      title: "Produto adicionado",
      description: `${quantity}x ${product.name} adicionado ao carrinho.`,
    });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-muted py-4">
        <div className="container-padding mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Início
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link to="/loja" className="text-muted-foreground hover:text-foreground transition-colors">
              Loja
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={gallery[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background shadow-lg transition-colors"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background shadow-lg transition-colors"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                <Badge className="absolute top-4 left-4">{product.brand}</Badge>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {gallery.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? "border-secondary"
                          : "border-transparent hover:border-muted-foreground/30"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} - Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-secondary font-medium mb-2">{categoryName}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-secondary">
                  {formatPrice(product.price)}
                </span>
                {product.inStock ? (
                  <Badge variant="outline" className="text-green-600 border-green-600 gap-1">
                    <Check className="h-3 w-3" />
                    Em Stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    Indisponível
                  </Badge>
                )}
              </div>

              <Separator />

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-muted transition-colors"
                    aria-label="Diminuir quantidade"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-muted transition-colors"
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Adicionar ao Carrinho
                </Button>
              </div>

              {/* Contact for Quote */}
              <a
                href="https://wa.me/244942546887"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="whatsapp" size="lg" className="w-full gap-2">
                  <Phone className="h-5 w-5" />
                  Pedir Orçamento via WhatsApp
                </Button>
              </a>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Truck className="h-8 w-8 text-secondary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Entrega em Angola</p>
                    <p className="text-xs text-muted-foreground">Todo o território</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <Shield className="h-8 w-8 text-secondary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Garantia</p>
                    <p className="text-xs text-muted-foreground">Produtos originais</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {product.specs && product.specs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Especificações Técnicas
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.specs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-muted rounded-lg"
                  >
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium text-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Produtos Relacionados
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card key={relatedProduct.id} className="group overflow-hidden hover-lift">
                    <Link to={`/produto/${relatedProduct.id}`}>
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <Badge className="absolute top-3 left-3">{relatedProduct.brand}</Badge>
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <span className="text-lg font-bold text-secondary">
                          {formatPrice(relatedProduct.price)}
                        </span>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
