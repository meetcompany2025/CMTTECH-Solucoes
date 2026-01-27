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
import { useToast } from "@/hooks/use-toast";
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
  XCircle
} from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  nif: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  total: number;
  created_at: string;
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: "Pendente", icon: <Clock className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmado", icon: <CheckCircle className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" },
  processing: { label: "Em Processamento", icon: <Package className="h-4 w-4" />, color: "bg-purple-100 text-purple-800" },
  shipped: { label: "Enviado", icon: <Truck className="h-4 w-4" />, color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Entregue", icon: <CheckCircle className="h-4 w-4" />, color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelado", icon: <XCircle className="h-4 w-4" />, color: "bg-red-100 text-red-800" },
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
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    nif: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoadingProfile(false);
    // TODO: Implement profile fetching when API endpoint is available
    // Note: The current API (swagger.json) does not have /profiles endpoint
    // Profiles are managed as part of user preferences
  };

  const fetchOrders = async () => {
    if (!user) return;

    setLoadingOrders(false);
    // TODO: Implement orders fetching when API endpoint is available
    // The API has /orders endpoints, but needs integration with user orders
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    // TODO: Update user preferences using UserRepository
    // For now, show a message
    setSaving(false);

    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A atualização de perfil será implementada em breve.",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loadingProfile) {
    return <LoadingSpinner className="min-h-screen bg-muted" />;
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient py-16">
        <div className="container-padding mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-background">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Olá, {formData.full_name || "Cliente"}
              </h1>
              <p className="text-background/80">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="gap-2 w-fit bg-background/10 border-background/20 text-background hover:bg-background/20">
              <LogOut className="h-4 w-4" />
              Terminar Sessão
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-padding mx-auto">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" />
                Meus Pedidos
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Meu Perfil
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Histórico de Pedidos
                  </CardTitle>
                  <CardDescription>
                    Acompanhe o estado dos seus pedidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-secondary" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Ainda não tem pedidos
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Explore a nossa loja e faça o seu primeiro pedido.
                      </p>
                      <Link to="/loja">
                        <Button variant="secondary">Visitar Loja</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const status = statusConfig[order.status] || statusConfig.pending;
                        return (
                          <div
                            key={order.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted rounded-lg"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-foreground">
                                  {order.order_number}
                                </span>
                                <Badge className={`${status.color} gap-1`}>
                                  {status.icon}
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString("pt-PT", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-secondary">
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                  <CardDescription>
                    Atualize os seus dados para facilitar futuras compras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Nome Completo</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="O seu nome"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+244 900 000 000"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">Morada de Faturação</h3>
                      <div className="space-y-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Rua, número, bairro"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">Cidade</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Ex: Lubango"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="province">Província</Label>
                          <Input
                            id="province"
                            value={formData.province}
                            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                            placeholder="Ex: Huíla"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nif">NIF</Label>
                        <Input
                          id="nif"
                          value={formData.nif}
                          onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                          placeholder="Número de Identificação Fiscal"
                        />
                      </div>
                    </div>

                    <Button type="submit" variant="secondary" className="gap-2" disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Guardar Alterações
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
