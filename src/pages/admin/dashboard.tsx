import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { StatsCard } from '@/components/admin/stats-card';
import { StatusBadge } from '@/components/admin/status-badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { OrderRepository } from '@/data/repositories/order.repository.impl';
import { ProductRepository } from '@/data/repositories/product.repository.impl';
import { AnalyticsRepository } from '@/data/repositories/analytics.repository.impl';
import { Order } from '@/domain/entities/order.entity';
import { Product } from '@/domain/entities/product.entity';
import { AnalyticsDashboard } from '@/domain/entities/analytics.entity';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const analyticsRepository = new AnalyticsRepository();

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Load repositories data
            const [ordersData, productsData] = await Promise.all([
                orderRepository.getAll({ limit: 5 }).catch(() => ({ orders: [], total: 0 })),
                productRepository.getAll({ limit: 1000 }).catch(() => ({ products: [], total: 0 }))
            ]);

            setRecentOrders(ordersData.orders);
            const lowStock = productsData.products.filter(p => p.stock_quantidade < 10);
            setLowStockProducts(lowStock);

            // Load Analytics with individual fallback for each slice
            try {
                const [stats, daily, top, status] = await Promise.all([
                    analyticsRepository.getOverview().catch(() => null),
                    analyticsRepository.getDailySales().catch(() => []),
                    analyticsRepository.getTopProducts({ limit: 5 }).catch(() => []),
                    analyticsRepository.getOrderStatusStats().catch(() => [])
                ]);

                // Even if getOverview fails, provide minimal stats from calculation as fallback
                const paidOrders = ordersData.orders.filter(o => o.status_pagamento === 'pago');
                const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

                const fallbackStats = {
                    total_receita: totalRevenue,
                    total_pedidos: ordersData.total || 0,
                    ticket_medio: ordersData.total > 0 ? totalRevenue / ordersData.total : 0,
                    crescimento_receita: 0,
                    crescimento_pedidos: 0
                };

                setAnalytics({
                    stats: stats || fallbackStats,
                    vendas_diarias: daily || [],
                    produtos_top: top || [],
                    estados_encomendas: status || []
                });
            } catch (anaError) {
                console.error('Analytics load error:', anaError);
                // Last ditch fallback if all analytics fail
                setAnalytics({
                    stats: { total_receita: 0, total_pedidos: 0, ticket_medio: 0, crescimento_receita: 0, crescimento_pedidos: 0 },
                    vendas_diarias: [],
                    produtos_top: [],
                    estados_encomendas: []
                });
            }

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA',
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (loading) {
        return <LoadingSpinner className="min-h-[400px]" />;
    }

    // Default analytics if still null after loading (should not happen with fallbacks)
    const analyticsData = analytics || {
        stats: { total_receita: 0, total_pedidos: 0, ticket_medio: 0, crescimento_receita: 0, crescimento_pedidos: 0 },
        vendas_diarias: [],
        produtos_top: [],
        estados_encomendas: []
    };

    const { stats, vendas_diarias, produtos_top, estados_encomendas } = analyticsData;

    return (
        <div className="space-y-6 pb-8">
            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Central</h1>
                <p className="text-muted-foreground">Monitorização analítica e operacional em tempo real.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Receita Total"
                    value={formatCurrency(stats.total_receita)}
                    icon={<DollarSign className="text-emerald-500" />}
                    description={
                        <div className="flex items-center gap-1">
                            {stats.crescimento_receita >= 0 ? (
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-rose-500" />
                            )}
                            <span className={stats.crescimento_receita >= 0 ? "text-emerald-500" : "text-rose-500"}>
                                {Math.abs(stats.crescimento_receita)}%
                            </span>
                            <span className="text-xs text-muted-foreground">vs mês anterior</span>
                        </div>
                    }
                />
                <StatsCard
                    title="Novas Encomendas"
                    value={stats.total_pedidos}
                    icon={<ShoppingCart className="text-blue-500" />}
                    description={
                        <div className="flex items-center gap-1">
                            {stats.crescimento_pedidos >= 0 ? (
                                <TrendingUp className="h-3 w-3 text-blue-500" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-rose-500" />
                            )}
                            <span className={stats.crescimento_pedidos >= 0 ? "text-blue-500" : "text-rose-500"}>
                                {Math.abs(stats.crescimento_pedidos)}%
                            </span>
                            <span className="text-xs text-muted-foreground">período actual</span>
                        </div>
                    }
                />
                <StatsCard
                    title="Ticket Médio"
                    value={formatCurrency(stats.ticket_medio)}
                    icon={<TrendingUp className="text-amber-500" />}
                    description="Valor médio por pedido"
                />
                <StatsCard
                    title="Alertas de Stock"
                    value={lowStockProducts.length}
                    icon={<AlertTriangle className="text-rose-500" />}
                    description={`${lowStockProducts.filter(p => p.stock_quantidade === 0).length} sem stock`}
                />
            </div>

            {/* Charts Row 1: Sales Trend */}
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Tendência de Vendas</CardTitle>
                    <CardDescription>Visualização da receita diária nos últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] pl-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={vendas_diarias}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="data"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(str) => {
                                    const date = new Date(str);
                                    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
                                }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(val) => `Kz ${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                                formatter={(value: number) => [formatCurrency(value), 'Receita']}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Top Products */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Produtos Mais Vendidos</CardTitle>
                        <CardDescription>Top 5 produtos por volume de venda</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] pb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={produtos_top} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="nome"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                    formatter={(value: number, name: string) => [
                                        name === 'quantidade_vendida' ? `${value} unidades` : formatCurrency(value),
                                        name === 'quantidade_vendida' ? 'Vendidos' : 'Faturado'
                                    ]}
                                />
                                <Bar dataKey="quantidade_vendida" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Order Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estado das Encomendas</CardTitle>
                        <CardDescription>Distribuição percentual actual</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={estados_encomendas}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="quantidade"
                                    nameKey="estado"
                                >
                                    {estados_encomendas.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Encomendas Recentes</CardTitle>
                            <CardDescription>Últimos pedidos realizados</CardDescription>
                        </div>
                        <Link to="/admin/orders">
                            <Button variant="ghost" size="sm" className="text-primary">Ver Tudo</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        to={`/admin/orders/${order.id}`}
                                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium">{order.numero_pedido}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.customer_nome || order.customer_email}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="font-medium text-sm">{formatCurrency(order.total)}</p>
                                            <StatusBadge status={order.status} variant="order" />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    Nenhuma encomenda recente
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Critical Stock */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Alertas Críticos</CardTitle>
                            <CardDescription>Produtos com stock insuficiente</CardDescription>
                        </div>
                        <Link to="/admin/stock">
                            <Button variant="ghost" size="sm" className="text-primary">Gerir Stock</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {lowStockProducts.length > 0 ? (
                                lowStockProducts.slice(0, 5).map((product) => (
                                    <Link
                                        key={product.id}
                                        to={`/admin/products/${product.id}/edit`}
                                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {product.imagem_principal ? (
                                                <img
                                                    src={product.imagem_principal}
                                                    alt={product.nome}
                                                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                                    <Package className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="overflow-hidden">
                                                <p className="font-medium text-sm truncate">{product.nome}</p>
                                                <p className="text-xs text-muted-foreground">{product.sku}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-bold text-sm text-rose-500">
                                                {product.stock_quantidade} un.
                                            </p>
                                            <StatusBadge
                                                status={product.stock_quantidade === 0 ? 'sem_stock' : 'baixo'}
                                                variant="stock"
                                            />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    Nenhum alerta crítico no momento
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

