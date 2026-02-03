import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { DataTable } from '@/components/admin/data-table';
import { NotificationRepository } from '@/data/repositories/notification.repository.impl';
import { EmailNotification } from '@/domain/entities/notification.entity';
import { toast } from 'sonner';
import { 
    Eye, 
    Mail, 
    RotateCw, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Send,
    AlertTriangle
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const notificationRepository = new NotificationRepository();

const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; icon: JSX.Element; label: string }> = {
        enviado: { 
            color: 'bg-green-100 text-green-800', 
            icon: <CheckCircle2 className="h-3 w-3" />,
            label: 'Enviado' 
        },
        pendente: { 
            color: 'bg-yellow-100 text-yellow-800', 
            icon: <Clock className="h-3 w-3" />,
            label: 'Pendente' 
        },
        falhou: { 
            color: 'bg-red-100 text-red-800', 
            icon: <XCircle className="h-3 w-3" />,
            label: 'Falhou' 
        },
        em_fila: { 
            color: 'bg-blue-100 text-blue-800', 
            icon: <Clock className="h-3 w-3" />,
            label: 'Em Fila' 
        },
    };

    const config = statusMap[status.toLowerCase()] || { 
        color: 'bg-gray-100 text-gray-800', 
        icon: <Mail className="h-3 w-3" />,
        label: status 
    };
    
    return (
        <Badge className={`${config.color} flex items-center gap-1`}>
            {config.icon}
            {config.label}
        </Badge>
    );
};

const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { color: string; label: string }> = {
        confirmacao_pedido: { color: 'bg-blue-100 text-blue-800', label: 'Confirmação Pedido' },
        atualizacao_pedido: { color: 'bg-purple-100 text-purple-800', label: 'Atualização Pedido' },
        alerta_stock: { color: 'bg-orange-100 text-orange-800', label: 'Alerta Stock' },
        boas_vindas: { color: 'bg-green-100 text-green-800', label: 'Boas-Vindas' },
        geral: { color: 'bg-gray-100 text-gray-800', label: 'Geral' },
    };

    const config = typeMap[type.toLowerCase()] || { color: 'bg-gray-100 text-gray-800', label: type };
    return <Badge variant="outline" className={config.color}>{config.label}</Badge>;
};

export default function NotificationsList() {
    const [notifications, setNotifications] = useState<EmailNotification[]>([]);
    const [pendingNotifications, setPendingNotifications] = useState<EmailNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotification, setSelectedNotification] = useState<EmailNotification | null>(null);
    const [testEmailDialogOpen, setTestEmailDialogOpen] = useState(false);
    const [testEmail, setTestEmail] = useState('');
    const [testName, setTestName] = useState('');
    const [sendingTestEmail, setSendingTestEmail] = useState(false);
    const [retryingId, setRetryingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [allData, pendingData] = await Promise.all([
                notificationRepository.getAll({ limit: 100 }),
                notificationRepository.getPending({ limit: 50 }),
            ]);
            setNotifications(allData);
            setPendingNotifications(pendingData);
        } catch (error) {
            toast.error('Falha ao carregar notificações');
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = async (notificationId: string) => {
        try {
            setRetryingId(notificationId);
            await notificationRepository.retry(notificationId);
            toast.success('E-mail reenviado com sucesso');
            loadData();
        } catch (error) {
            toast.error('Falha ao reenviar e-mail');
        } finally {
            setRetryingId(null);
        }
    };

    const handleSendTestEmail = async () => {
        if (!testEmail) {
            toast.error('Preencha o e-mail');
            return;
        }

        try {
            setSendingTestEmail(true);
            await notificationRepository.sendTestEmail({
                to_email: testEmail,
                to_name: testName || undefined,
            });
            toast.success('E-mail de teste enviado com sucesso');
            setTestEmailDialogOpen(false);
            setTestEmail('');
            setTestName('');
            loadData();
        } catch (error) {
            toast.error('Falha ao enviar e-mail de teste');
        } finally {
            setSendingTestEmail(false);
        }
    };

    const columns: ColumnDef<EmailNotification>[] = [
        {
            accessorKey: 'created_at',
            header: 'Data/Hora',
            cell: ({ row }) => {
                const date = row.original.created_at;
                if (!date) return '-';
                return (
                    <div className="flex flex-col">
                        <span className="text-sm">
                            {new Date(date).toLocaleDateString('pt-AO', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {new Date(date).toLocaleTimeString('pt-AO', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'destinatario_email',
            header: 'Destinatário',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{row.original.destinatario_email}</span>
                </div>
            ),
        },
        {
            accessorKey: 'assunto',
            header: 'Assunto',
            cell: ({ row }) => (
                <span className="max-w-[200px] truncate block" title={row.original.assunto}>
                    {row.original.assunto}
                </span>
            ),
        },
        {
            accessorKey: 'tipo',
            header: 'Tipo',
            cell: ({ row }) => getTypeBadge(row.original.tipo),
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            cell: ({ row }) => getStatusBadge(row.original.estado),
        },
        {
            accessorKey: 'tentativas',
            header: 'Tentativas',
            cell: ({ row }) => (
                <span className={`text-sm ${row.original.tentativas > 1 ? 'text-orange-600' : ''}`}>
                    {row.original.tentativas}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Ações',
            cell: ({ row }) => {
                const notification = row.original;
                const isFailed = notification.estado === 'falhou';
                const isRetrying = retryingId === notification.id;

                return (
                    <div className="flex items-center gap-1">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedNotification(notification)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        {isFailed && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRetry(notification.id)}
                                disabled={isRetrying}
                            >
                                <RotateCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Notificações por E-mail</h1>
                    <p className="text-muted-foreground">
                        Gerir e monitorar e-mails enviados pelo sistema
                    </p>
                </div>
                <Button onClick={() => setTestEmailDialogOpen(true)}>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar E-mail de Teste
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Todos
                        <Badge variant="secondary" className="ml-1">{notifications.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Pendentes/Falhas
                        <Badge variant="secondary" className="ml-1">{pendingNotifications.length}</Badge>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                    <DataTable 
                        columns={columns} 
                        data={notifications} 
                        loading={loading}
                    />
                </TabsContent>

                <TabsContent value="pending" className="mt-4">
                    <DataTable 
                        columns={columns} 
                        data={pendingNotifications} 
                        loading={loading}
                    />
                </TabsContent>
            </Tabs>

            {/* Detail Dialog */}
            <Dialog 
                open={!!selectedNotification} 
                onOpenChange={(open) => !open && setSelectedNotification(null)}
            >
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Detalhes da Notificação
                        </DialogTitle>
                        <DialogDescription>
                            {selectedNotification?.assunto}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="h-[50vh] pr-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Destinatário
                                    </label>
                                    <p className="mt-1">{selectedNotification?.destinatario_email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Estado</label>
                                    <div className="mt-1">
                                        {selectedNotification && getStatusBadge(selectedNotification.estado)}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                                    <div className="mt-1">
                                        {selectedNotification && getTypeBadge(selectedNotification.tipo)}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tentativas</label>
                                    <p className="mt-1">{selectedNotification?.tentativas}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                                    <p className="mt-1 text-sm">
                                        {selectedNotification?.created_at 
                                            ? new Date(selectedNotification.created_at).toLocaleString('pt-AO')
                                            : '-'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Enviado em</label>
                                    <p className="mt-1 text-sm">
                                        {selectedNotification?.enviado_at 
                                            ? new Date(selectedNotification.enviado_at).toLocaleString('pt-AO')
                                            : '-'
                                        }
                                    </p>
                                </div>
                            </div>

                            {selectedNotification?.relacionado_tipo && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Relacionado a
                                    </label>
                                    <p className="mt-1 text-sm">
                                        <Badge variant="outline">{selectedNotification.relacionado_tipo}</Badge>
                                        <span className="ml-2 font-mono text-xs">
                                            {selectedNotification.relacionado_id?.slice(0, 8)}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {selectedNotification?.erro_mensagem && (
                                <div>
                                    <label className="text-sm font-medium text-red-600">Mensagem de Erro</label>
                                    <p className="mt-1 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                        {selectedNotification.erro_mensagem}
                                    </p>
                                </div>
                            )}

                            <Separator />

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Conteúdo HTML
                                </label>
                                <div 
                                    className="mt-2 p-4 bg-gray-50 border rounded-md prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ 
                                        __html: selectedNotification?.corpo_html || '' 
                                    }}
                                />
                            </div>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Test Email Dialog */}
            <Dialog open={testEmailDialogOpen} onOpenChange={setTestEmailDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5" />
                            Enviar E-mail de Teste
                        </DialogTitle>
                        <DialogDescription>
                            Envie um e-mail de teste para verificar se o sistema de notificações está funcionando.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="test-email">E-mail *</Label>
                            <Input
                                id="test-email"
                                type="email"
                                placeholder="exemplo@email.com"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="test-name">Nome (opcional)</Label>
                            <Input
                                id="test-name"
                                type="text"
                                placeholder="Nome do destinatário"
                                value={testName}
                                onChange={(e) => setTestName(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setTestEmailDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSendTestEmail} disabled={sendingTestEmail}>
                            {sendingTestEmail ? (
                                <>
                                    <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Enviar
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
