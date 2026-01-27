import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CreditCard, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/admin/status-badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { OrderRepository } from '@/data/repositories/order.repository.impl';
import { Order, OrderStatus } from '@/domain/entities/order.entity';
import { toast } from 'sonner';

const orderRepository = new OrderRepository();

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) {
            loadOrder(id);
        }
    }, [id]);

    const loadOrder = async (orderId: string) => {
        try {
            setLoading(true);
            const data = await orderRepository.getById(orderId);
            setOrder(data);
        } catch (error) {
            toast.error('Falha ao carregar detalhes da encomenda');
            navigate('/admin/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!order) return;
        try {
            setUpdating(true);
            const updatedOrder = await orderRepository.updateStatus(order.id, { status: newStatus as OrderStatus });
            setOrder(updatedOrder);
            toast.success('Estado da encomenda atualizado');
        } catch (error) {
            toast.error('Falha ao atualizar estado');
        } finally {
            setUpdating(false);
        }
    };

    const handlePaymentStatusChange = async (newStatus: string) => {
        if (!order) return;
        try {
            setUpdating(true);
            const updatedOrder = await orderRepository.updateStatus(order.id, { status_pagamento: newStatus as any });
            setOrder(updatedOrder);
            toast.success('Estado do pagamento atualizado');
        } catch (error) {
            toast.error('Falha ao atualizar pagamento');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <LoadingSpinner className="min-h-screen" />;
    if (!order) return null;

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/orders')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Encomenda #{order.numero_pedido}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.created_at)}</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Detalhes da Encomenda</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Estado</span>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={order.status} variant="order" />
                                <Select
                                    value={order.status}
                                    onValueChange={handleStatusChange}
                                    disabled={updating}
                                >
                                    <SelectTrigger className="w-[140px] h-8">
                                        <SelectValue placeholder="Alterar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pendente">Pendente</SelectItem>
                                        <SelectItem value="em_processamento">Processamento</SelectItem>
                                        <SelectItem value="enviado">Enviado</SelectItem>
                                        <SelectItem value="entregue">Entregue</SelectItem>
                                        <SelectItem value="cancelado">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Pagamento</span>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={order.status_pagamento} variant="payment" />
                                <Select
                                    value={order.status_pagamento}
                                    onValueChange={handlePaymentStatusChange}
                                    disabled={updating}
                                >
                                    <SelectTrigger className="w-[140px] h-8">
                                        <SelectValue placeholder="Alterar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pendente">Pendente</SelectItem>
                                        <SelectItem value="pago">Pago</SelectItem>
                                        <SelectItem value="falhado">Falhado</SelectItem>
                                        <SelectItem value="reembolsado">Reembolsado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Cliente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {order.customer_nome ? (
                            <div className="space-y-1">
                                <div className="font-medium">{order.customer_nome}</div>
                                <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                                <div className="text-sm text-muted-foreground">{order.customer_telefone}</div>
                            </div>
                        ) : (
                            <div className="text-muted-foreground">Cliente removido ou não disponível</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Itens</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                                        <Package className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{item.produto_nome}</div>
                                        <div className="text-sm text-muted-foreground">SKU: {item.sku || 'N/A'}</div>
                                        <div className="text-sm">
                                            {item.quantidade} x {formatCurrency(item.preco_unitario)}
                                        </div>
                                    </div>
                                </div>
                                <div className="font-medium">{formatCurrency(item.subtotal)}</div>
                            </div>
                        ))}

                        <div className="pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Entrega</span>
                                <span>{formatCurrency(order.taxa_entrega)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Impostos</span>
                                <span>{formatCurrency(order.imposto)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold pt-2 border-t">
                                <span>Total</span>
                                <span>{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
