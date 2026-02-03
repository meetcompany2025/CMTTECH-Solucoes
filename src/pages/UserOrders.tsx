import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { OrderRepository } from "@/data/repositories/order.repository.impl";
import { Order } from "@/domain/entities/order.entity";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatPrice } from "@/data/products";
import { 
  ShoppingBag, 
  Calendar, 
  ArrowRight, 
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

function getStatusIcon(status: string) {
  switch (status) {
    case 'pendente':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'confirmado':
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    case 'em_processamento':
      return <Package className="h-4 w-4 text-purple-500" />;
    case 'enviado':
      return <Truck className="h-4 w-4 text-orange-500" />;
    case 'entregue':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'cancelado':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
}

function getStatusBadge(status: string) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    'pendente': 'secondary',
    'confirmado': 'default',
    'em_processamento': 'secondary',
    'enviado': 'secondary',
    'entregue': 'default',
    'cancelado': 'destructive'
  };
  
  return (
    <Badge variant={variants[status] || 'secondary'} className="capitalize">
      {status.replace('_', ' ')}
    </Badge>
  );
}

function getPaymentStatusBadge(status: string) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    'pendente': 'secondary',
    'pago': 'default',
    'falhado': 'destructive',
    'reembolsado': 'outline'
  };
  
  return (
    <Badge variant={variants[status] || 'secondary'} className="capitalize">
      {status}
    </Badge>
  );
}

export default function UserOrders() {
  return (
    <ProtectedRoute redirectTo="/auth">
      <UserOrdersContent />
    </ProtectedRoute>
  );
}

function UserOrdersContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderRepository = new OrderRepository();
        const result = await orderRepository.getAll({ limit: 20 });
        setOrders(result.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Erro ao carregar pedidos",
          description: "Não foi possível carregar o histórico de pedidos.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          <span className="text-muted-foreground">A carregar pedidos...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-padding mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meus Pedidos
          </h1>
          <p className="text-muted-foreground text-lg">
            Acompanhe o status dos seus pedidos e histórico de compras.
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Você ainda não fez nenhum pedido. Explore nossa loja e faça sua primeira compra!
              </p>
              <Link to="/loja">
                <Button variant="hero">
                  Explorar Loja
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          Pedido #{order.numero_pedido}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.created_at).toLocaleDateString('pt-AO')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Order Items Preview */}
                  <div className="space-y-3 mb-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.quantidade}x {item.produto_nome}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-muted-foreground">
                        +{order.items.length - 3} mais itens
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  {/* Order Summary */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Entrega:</span>
                      <span>{formatPrice(order.taxa_entrega)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-lg text-secondary">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      Pagamento: {order.metodo_pagamento}
                    </span>
                    {getPaymentStatusBadge(order.status_pagamento)}
                  </div>

                  {/* Action Button */}
                  <Link to={`/order-details/${order.id}`}>
                    <Button variant="outline" className="w-full">
                      Ver Detalhes
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}