import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerRepository } from '@/data/repositories/customer.repository.impl';
import { Customer } from '@/domain/entities/customer.entity';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Mail, Phone, Calendar, ShoppingBag, MapPin, ArrowLeft } from 'lucide-react';

const customerRepository = new CustomerRepository();

export default function CustomerDetails() {
    const { id } = useParams();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) loadCustomer(id);
    }, [id]);

    const loadCustomer = async (customerId: string) => {
        try {
            setLoading(true);
            const data = await customerRepository.getById(customerId);
            setCustomer(data);
        } catch (error) {
            toast.error('Falha ao carregar cliente');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Carregando...</div>;
    if (!customer) return <div className="p-8">Cliente não encontrado</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/customers">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">{customer.nome}</h1>
                    <p className="text-muted-foreground">{customer.email}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Dados Pessoais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{customer.telefone || 'Sem telefone'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Desde {format(new Date(customer.created_at), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className="pt-4 border-t space-y-2">
                            <div className="text-sm font-medium">NIF</div>
                            <div className="text-sm text-muted-foreground">{customer.nif || 'N/A'}</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Notas Internas</div>
                            <div className="text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900 p-2 rounded">
                                {customer.notas_internas || 'Nenhuma nota'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats & Addresses */}
                <div className="md:col-span-2 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(customer.total_gasto)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{customer.total_compras}</div>
                                {customer.ultimo_pedido_at && (
                                    <p className="text-xs text-muted-foreground">
                                        Último: {format(new Date(customer.ultimo_pedido_at), 'dd/MM/yyyy')}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Addresses */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Endereços Guardados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {customer.enderecos.length === 0 ? (
                                <p className="text-muted-foreground text-sm">Nenhum endereço registado.</p>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {customer.enderecos.map((addr, idx) => (
                                        <div key={idx} className="border rounded-lg p-4 space-y-2 relative">
                                            <div className="flex items-start justify-between">
                                                <div className="font-medium flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                    {addr.tipo === 'entrega' ? 'Entrega' : 'Faturação'}
                                                </div>
                                            </div>
                                            <div className="text-sm space-y-1 text-muted-foreground">
                                                <p>{addr.rua} {addr.numero_casa}</p>
                                                <p>{addr.bairro}</p>
                                                <p>{addr.municipio}, {addr.provincia}</p>
                                                {addr.ponto_referencia && <p className="text-xs italic">Ref: {addr.ponto_referencia}</p>}
                                                {addr.telefone && <p className="text-xs">Tel: {addr.telefone}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
