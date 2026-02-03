import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { OrderRepository } from "@/data/repositories/order.repository.impl";
import { Order } from "@/domain/entities/order.entity";
import {
  Loader2,
  User,
  Package,
  LogOut,
  Save,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  UserCircle,
  Home,
  Edit,
  Eye,
  RefreshCw
} from "lucide-react";

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pendente: { label: "Pendente", icon: <Clock className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-800" },
  confirmado: { label: "Confirmado", icon: <CheckCircle className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" },
  em_processamento: { label: "Em Processamento", icon: <Package className="h-4 w-4" />, color: "bg-purple-100 text-purple-800" },
  enviado: { label: "Enviado", icon: <Truck className="h-4 w-4" />, color: "bg-indigo-100 text-indigo-800" },
  entregue: { label: "Entregue", icon: <CheckCircle className="h-4 w-4" />, color: "bg-green-100 text-green-800" },
  cancelado: { label: "Cancelado", icon: <XCircle className="h-4 w-4" />, color: "bg-red-100 text-red-800" },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  pendente: { label: "Aguardando Pagamento", color: "bg-orange-100 text-orange-800" },
  pago: { label: "Pago", color: "bg-green-100 text-green-800" },
  falhado: { label: "Falhado", color: "bg-red-100 text-red-800" },
  reembolsado: { label: "Reembolsado", color: "bg-gray-100 text-gray-800" },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function ClientArea() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { items, totalPrice, updateQuantity, removeItem } = useCart();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoadingOrders(true);
    try {
      const orderRepository = new OrderRepository();
      const { orders: fetchedOrders } = await orderRepository.getAll({ limit: 50 });
      
      // Filtrar apenas as encomendas do cliente atual
      const clienteId = user.cliente?.id;
      const userOrders = clienteId 
        ? fetchedOrders.filter(order => order.customer_id === clienteId)
        : fetchedOrders;
      
      // Ordenar por data mais recente
      userOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setOrders(userOrders);
    } catch (error) {
      console.error('Erro ao buscar encomendas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as suas encomendas.",
        variant: "destructive"
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (authLoading) {
    return <LoadingSpinner className="min-h-screen bg-slate-50" />;
  }

  const cliente = user?.cliente;
  const enderecos = cliente?.enderecos || [];
  const enderecoPrincipal = enderecos.find((e: any) => e.predefinido) || enderecos[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(cliente?.nome || user?.username || "U")
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Olá, {cliente?.nome || user?.username || "Cliente"}
                </h1>
                <p className="text-slate-300 flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut} 
              className="gap-2 w-fit bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" />
              Terminar Sessão
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">{cliente?.total_compras || 0}</div>
              <div className="text-sm text-slate-300">Compras</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">{formatPrice(cliente?.total_gasto || 0)}</div>
              <div className="text-sm text-slate-300">Total Gasto</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">{items.length}</div>
              <div className="text-sm text-slate-300">No Carrinho</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">{enderecos.length}</div>
              <div className="text-sm text-slate-300">Endereços</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8 bg-white shadow-sm">
              <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Pedidos</span>
              </TabsTrigger>
              <TabsTrigger value="cart" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Carrinho</span>
                {items.length > 0 && (
                  <Badge className="ml-1 bg-blue-100 text-blue-700 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {items.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="addresses" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Endereços</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Info Card */}
                <Card className="lg:col-span-2 shadow-sm border-slate-200">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <UserCircle className="h-5 w-5 text-blue-600" />
                      Informações Pessoais
                    </CardTitle>
                    <CardDescription>
                      Os seus dados de conta e contacto
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Nome Completo</label>
                        <p className="text-slate-900 font-medium">{cliente?.nome || user?.username || "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</label>
                        <p className="text-slate-900 font-medium">{cliente?.email || user?.email || "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Telefone</label>
                        <p className="text-slate-900 font-medium flex items-center gap-2">
                          {cliente?.telefone || enderecoPrincipal?.telefone || (
                            <span className="text-slate-400">Não definido</span>
                          )}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">NIF</label>
                        <p className="text-slate-900 font-medium">
                          {cliente?.nif || <span className="text-slate-400">Não definido</span>}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Data de Nascimento</label>
                        <p className="text-slate-900 font-medium">
                          {cliente?.data_nascimento ? new Date(cliente.data_nascimento).toLocaleDateString("pt-PT") : (
                            <span className="text-slate-400">Não definido</span>
                          )}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Género</label>
                        <p className="text-slate-900 font-medium">
                          {cliente?.genero || <span className="text-slate-400">Não definido</span>}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cliente Desde</label>
                        <p className="text-slate-900 font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {cliente?.created_at ? new Date(cliente.created_at).toLocaleDateString("pt-PT", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          }) : "—"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Newsletter</label>
                        <Badge className={cliente?.newsletter_aceite ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}>
                          {cliente?.newsletter_aceite ? "Subscrito" : "Não subscrito"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Side Card - Quick Address */}
                <div className="space-y-6">
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="border-b border-slate-100">
                      <CardTitle className="flex items-center gap-2 text-slate-900 text-base">
                        <Home className="h-5 w-5 text-blue-600" />
                        Endereço Principal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {enderecoPrincipal ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {enderecoPrincipal.tipo === "entrega" ? "Entrega" : "Faturação"}
                            </Badge>
                            {enderecoPrincipal.predefinido && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">Principal</Badge>
                            )}
                          </div>
                          <div className="text-sm space-y-1">
                            <p className="font-medium text-slate-900">{enderecoPrincipal.nome_destinatario}</p>
                            <p className="text-slate-600">
                              {enderecoPrincipal.rua}, {enderecoPrincipal.numero_casa}
                            </p>
                            <p className="text-slate-600">
                              {enderecoPrincipal.bairro}, {enderecoPrincipal.municipio}
                            </p>
                            <p className="text-slate-600">{enderecoPrincipal.provincia}</p>
                            {enderecoPrincipal.telefone && (
                              <p className="text-slate-600 flex items-center gap-1 mt-2">
                                <Phone className="h-3 w-3" /> {enderecoPrincipal.telefone}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-500 text-sm">Nenhum endereço cadastrado</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Activity Card */}
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="border-b border-slate-100">
                      <CardTitle className="flex items-center gap-2 text-slate-900 text-base">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        Resumo de Compras
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 text-sm">Total de Compras</span>
                          <span className="font-semibold text-slate-900">{cliente?.total_compras || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 text-sm">Valor Total</span>
                          <span className="font-semibold text-blue-600">{formatPrice(cliente?.total_gasto || 0)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 text-sm">Último Pedido</span>
                          <span className="text-sm text-slate-900">
                            {cliente?.ultimo_pedido_at 
                              ? new Date(cliente.ultimo_pedido_at).toLocaleDateString("pt-PT")
                              : "Nenhum"
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              {selectedOrder ? (
                /* Order Details View */
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Package className="h-5 w-5 text-blue-600" />
                          Encomenda #{selectedOrder.numero_pedido}
                        </CardTitle>
                        <CardDescription>
                          {new Date(selectedOrder.created_at).toLocaleDateString("pt-PT", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedOrder(null)}
                        className="border-slate-200"
                      >
                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                        Voltar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                      {/* Order Info */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Status */}
                        <div className="flex flex-wrap gap-3">
                          <div>
                            <span className="text-xs text-slate-500 block mb-1">Estado da Encomenda</span>
                            <Badge className={`${(statusConfig[selectedOrder.status] || statusConfig.pendente).color} gap-1`}>
                              {(statusConfig[selectedOrder.status] || statusConfig.pendente).icon}
                              {(statusConfig[selectedOrder.status] || statusConfig.pendente).label}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 block mb-1">Estado do Pagamento</span>
                            <Badge className={(paymentStatusConfig[selectedOrder.status_pagamento] || paymentStatusConfig.pendente).color}>
                              {(paymentStatusConfig[selectedOrder.status_pagamento] || paymentStatusConfig.pendente).label}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 block mb-1">Método de Pagamento</span>
                            <Badge variant="outline" className="capitalize">
                              {selectedOrder.metodo_pagamento?.replace('_', ' ') || 'N/A'}
                            </Badge>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Produtos</h4>
                          <div className="space-y-3">
                            {selectedOrder.items.map((item) => (
                              <div 
                                key={item.id}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-slate-300" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-900">{item.produto_nome}</p>
                                    <p className="text-sm text-slate-500">
                                      {item.quantidade}x {formatPrice(item.preco_unitario || (item.subtotal / item.quantidade))}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-semibold text-slate-900">{formatPrice(item.subtotal)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Address */}
                        {selectedOrder.morada_entrega && (
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-3">Endereço de Entrega</h4>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                              <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div className="text-sm">
                                  <p className="text-slate-900">{selectedOrder.morada_entrega.rua}</p>
                                  <p className="text-slate-600">
                                    {selectedOrder.morada_entrega.cidade}, {selectedOrder.morada_entrega.provincia}
                                  </p>
                                  {selectedOrder.morada_entrega.codigo_postal && (
                                    <p className="text-slate-600">{selectedOrder.morada_entrega.codigo_postal}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {selectedOrder.notas && (
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-3">Notas</h4>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                              <p className="text-sm text-slate-600">{selectedOrder.notas}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div>
                        <div className="bg-slate-900 rounded-xl p-6 text-white sticky top-8">
                          <h4 className="font-semibold mb-4">Resumo</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-slate-300">
                              <span>Subtotal</span>
                              <span>{formatPrice(selectedOrder.subtotal)}</span>
                            </div>
                            {selectedOrder.desconto > 0 && (
                              <div className="flex justify-between text-green-400">
                                <span>Desconto</span>
                                <span>-{formatPrice(selectedOrder.desconto)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-slate-300">
                              <span>Taxa de Entrega</span>
                              <span>{selectedOrder.taxa_entrega > 0 ? formatPrice(selectedOrder.taxa_entrega) : 'Grátis'}</span>
                            </div>
                            {selectedOrder.imposto > 0 && (
                              <div className="flex justify-between text-slate-300">
                                <span>Imposto</span>
                                <span>{formatPrice(selectedOrder.imposto)}</span>
                              </div>
                            )}
                            <Separator className="bg-slate-700" />
                            <div className="flex justify-between text-lg font-bold pt-2">
                              <span>Total</span>
                              <span>{formatPrice(selectedOrder.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Orders List View */
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                          <ShoppingBag className="h-5 w-5 text-blue-600" />
                          Minhas Encomendas
                        </CardTitle>
                        <CardDescription>
                          {orders.length > 0 
                            ? `${orders.length} ${orders.length === 1 ? 'encomenda' : 'encomendas'} encontradas`
                            : 'Acompanhe o estado dos seus pedidos'
                          }
                        </CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={fetchOrders}
                        disabled={loadingOrders}
                        className="border-slate-200"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loadingOrders ? 'animate-spin' : ''}`} />
                        Atualizar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {loadingOrders ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
                        <p className="text-slate-500">A carregar encomendas...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                          <Package className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          Ainda não tem encomendas
                        </h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                          Explore a nossa loja e faça a sua primeira encomenda para ver o histórico aqui.
                        </p>
                        <Link to="/loja">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Visitar Loja
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => {
                          const status = statusConfig[order.status] || statusConfig.pendente;
                          const paymentStatus = paymentStatusConfig[order.status_pagamento] || paymentStatusConfig.pendente;
                          return (
                            <div
                              key={order.id}
                              className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <span className="font-bold text-slate-900 text-lg">
                                      #{order.numero_pedido}
                                    </span>
                                    <Badge className={`${status.color} gap-1`}>
                                      {status.icon}
                                      {status.label}
                                    </Badge>
                                    <Badge className={paymentStatus.color}>
                                      {paymentStatus.label}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-500 flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(order.created_at).toLocaleDateString("pt-PT", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    {order.items.length} {order.items.length === 1 ? 'produto' : 'produtos'}
                                    {order.items.length > 0 && (
                                      <span className="text-slate-400"> • {order.items.map(i => i.produto_nome).slice(0, 2).join(', ')}{order.items.length > 2 && '...'}</span>
                                    )}
                                  </p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="font-bold text-blue-600 text-xl">
                                      {formatPrice(order.total)}
                                    </p>
                                    <p className="text-xs text-slate-500 capitalize">
                                      {order.metodo_pagamento?.replace('_', ' ')}
                                    </p>
                                  </div>
                                  <Button variant="outline" size="sm" className="border-slate-200 shrink-0">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Detalhes
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Cart Tab */}
            <TabsContent value="cart">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                    Carrinho de Compras
                  </CardTitle>
                  <CardDescription>
                    {items.length > 0 
                      ? `${items.length} ${items.length === 1 ? 'produto' : 'produtos'} no seu carrinho`
                      : 'O seu carrinho está vazio'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {items.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Carrinho Vazio
                      </h3>
                      <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                        Adicione produtos ao seu carrinho para começar a comprar.
                      </p>
                      <Link to="/loja">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Explorar Loja
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Cart Items */}
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100"
                          >
                            {/* Product Image */}
                            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center border border-slate-200 overflow-hidden shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="h-8 w-8 text-slate-300" />
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-900 truncate">{item.name}</h4>
                              <p className="text-sm text-slate-500">{item.brand}</p>
                              <p className="font-semibold text-blue-600 mt-1">{formatPrice(item.price)}</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-slate-200"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium text-slate-900">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-slate-200"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Item Total & Remove */}
                            <div className="text-right">
                              <p className="font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 mt-1 h-8 px-2"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Cart Summary */}
                      <div className="bg-slate-900 rounded-xl p-6 text-white">
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-slate-300">
                            <span>Subtotal</span>
                            <span>{formatPrice(totalPrice)}</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Taxa de Entrega</span>
                            <span className="text-green-400">Grátis</span>
                          </div>
                          <Separator className="bg-slate-700" />
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>{formatPrice(totalPrice)}</span>
                          </div>
                        </div>
                        <Link to="/checkout">
                          <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12 font-semibold">
                            Finalizar Compra
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-slate-900">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Meus Endereços
                      </CardTitle>
                      <CardDescription>
                        Gerencie os seus endereços de entrega e faturação
                      </CardDescription>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {enderecos.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <MapPin className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Nenhum endereço cadastrado
                      </h3>
                      <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                        Adicione um endereço para facilitar as suas compras.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Endereço
                      </Button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {enderecos.map((endereco: any) => (
                        <div
                          key={endereco.id}
                          className={`p-5 rounded-xl border-2 transition-colors ${
                            endereco.predefinido 
                              ? 'border-blue-200 bg-blue-50/50' 
                              : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {endereco.tipo}
                              </Badge>
                              {endereco.predefinido && (
                                <Badge className="bg-blue-100 text-blue-700 text-xs">Principal</Badge>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="font-semibold text-slate-900">{endereco.nome_destinatario}</p>
                            <div className="text-sm text-slate-600 space-y-0.5">
                              <p>{endereco.rua}, Nº {endereco.numero_casa}</p>
                              <p>{endereco.bairro}, {endereco.municipio}</p>
                              <p>{endereco.provincia} {endereco.codigo_postal && `- ${endereco.codigo_postal}`}</p>
                            </div>
                            {endereco.ponto_referencia && (
                              <p className="text-xs text-slate-500 italic">
                                Ref: {endereco.ponto_referencia}
                              </p>
                            )}
                            {endereco.telefone && (
                              <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100">
                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                {endereco.telefone}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
