import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { OrderRepository } from "@/data/repositories/order.repository.impl";
import { Order } from "@/domain/entities/order.entity";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatPrice } from "@/data/products";
import { 
  CheckCircle, 
  Package, 
  ArrowLeft, 
  Truck,
  Phone,
  Mail
} from "lucide-react";

function getStatusMessage(status: string) {
  switch (status) {
    case 'pendente':
      return {
        title: "Pedido Recebido!",
        message: "Seu pedido foi recebido e está aguardando confirmação.",
        icon: <CheckCircle className="h-16 w-16 text-green-500" />
      };
    case 'confirmado':
      return {
        title: "Pedido Confirmado!",
        message: "Seu pedido foi confirmado e está sendo preparado.",
        icon: <CheckCircle className="h-16 w-16 text-blue-500" />
      };
    case 'em_processamento':
      return {
        title: "Pedido em Processamento!",
        message: "Seu pedido está sendo preparado para envio.",
        icon: <Package className="h-16 w-16 text-purple-500" />
      };
    case 'enviado':
      return {
        title: "Pedido Enviado!",
        message: "Seu pedido foi enviado e está a caminho.",
        icon: <Truck className="h-16 w-16 text-orange-500" />
      };
    default:
      return {
        title: "Pedido Confirmado!",
        message: "Seu pedido foi recebido com sucesso.",
        icon: <CheckCircle className="h-16 w-16 text-green-500" />
      };
  }
}

export default function OrderSuccess() {
  return (
    <ProtectedRoute redirectTo="/auth">
      <OrderSuccessContent />
    </ProtectedRoute>
  );
}

function OrderSuccessContent() {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const orderRepository = new OrderRepository();
        const orderData = await orderRepository.getById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast({
          title: "Erro ao carregar pedido",
          description: "Não foi possível carregar os detalhes do pedido.",
          variant: "destructive"
        });
        navigate('/meus-pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, toast, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          <span className="text-muted-foreground">A carregar pedido...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Pedido não encontrado
          </h1>
          <Link to="/meus-pedidos">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Meus Pedidos
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const statusInfo = getStatusMessage(order.status);

  return (
    <section className="section-padding bg-background">
      <div className="container-padding mx-auto max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="mb-4">
            {statusInfo.icon}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {statusInfo.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {statusInfo.message}
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Número do Pedido</p>
                <p className="font-semibold text-lg">#{order.numero_pedido}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-bold text-lg text-secondary">
                  {formatPrice(order.total)}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.produto_nome}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      x{item.quantidade}
                    </span>
                  </div>
                  <span className="font-medium">
                    {formatPrice(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Método de Pagamento:</span>
                <span>{order.metodo_pagamento}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data do Pedido:</span>
                <span>{new Date(order.created_at).toLocaleDateString('pt-AO')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Options */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Precisa de Ajuda?
            </h3>
            <div className="space-y-3">
              <a
                href="https://wa.me/244942546887"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-secondary transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>Contactar via WhatsApp</span>
              </a>
              <a
                href="mailto:contato@cmttech.ao"
                className="flex items-center gap-3 text-foreground hover:text-secondary transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>Enviar Email</span>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/loja" className="flex-1">
            <Button variant="outline" className="w-full">
              Continuar Comprando
            </Button>
          </Link>
          <Link to="/meus-pedidos" className="flex-1">
            <Button variant="hero" className="w-full">
              Ver Meus Pedidos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}