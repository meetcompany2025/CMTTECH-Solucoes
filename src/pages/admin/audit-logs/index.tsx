import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/admin/data-table';
import { AuditLogRepository } from '@/data/repositories/audit-log.repository.impl';
import { AuditLog } from '@/domain/entities/audit-log.entity';
import { toast } from 'sonner';
import { Eye, FileText, User, Settings, Package, ShoppingCart, Users, CreditCard } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const auditLogRepository = new AuditLogRepository();

const getActionBadge = (action: string) => {
    const actionMap: Record<string, { color: string; label: string }> = {
        create: { color: 'bg-green-100 text-green-800', label: 'Criação' },
        update: { color: 'bg-blue-100 text-blue-800', label: 'Atualização' },
        delete: { color: 'bg-red-100 text-red-800', label: 'Eliminação' },
        login: { color: 'bg-purple-100 text-purple-800', label: 'Login' },
        logout: { color: 'bg-gray-100 text-gray-800', label: 'Logout' },
    };

    const config = actionMap[action.toLowerCase()] || { color: 'bg-gray-100 text-gray-800', label: action };
    return <Badge className={config.color}>{config.label}</Badge>;
};

const getEntityIcon = (entity: string) => {
    const iconMap: Record<string, JSX.Element> = {
        product: <Package className="h-4 w-4" />,
        order: <ShoppingCart className="h-4 w-4" />,
        user: <User className="h-4 w-4" />,
        customer: <Users className="h-4 w-4" />,
        payment: <CreditCard className="h-4 w-4" />,
        setting: <Settings className="h-4 w-4" />,
    };

    return iconMap[entity.toLowerCase()] || <FileText className="h-4 w-4" />;
};

export default function AuditLogsList() {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

    useEffect(() => {
        loadAuditLogs();
    }, []);

    const loadAuditLogs = async () => {
        try {
            setLoading(true);
            const data = await auditLogRepository.getAll({ limit: 100 });
            setAuditLogs(data);
        } catch (error) {
            toast.error('Falha ao carregar logs de auditoria');
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnDef<AuditLog>[] = [
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
            accessorKey: 'acao',
            header: 'Ação',
            cell: ({ row }) => getActionBadge(row.original.acao),
        },
        {
            accessorKey: 'entidade',
            header: 'Entidade',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {getEntityIcon(row.original.entidade)}
                    <span className="capitalize">{row.original.entidade}</span>
                </div>
            ),
        },
        {
            accessorKey: 'entidade_id',
            header: 'ID da Entidade',
            cell: ({ row }) => (
                <span className="font-mono text-xs text-muted-foreground">
                    {row.original.entidade_id?.slice(0, 8) || '-'}
                </span>
            ),
        },
        {
            accessorKey: 'ip_address',
            header: 'IP',
            cell: ({ row }) => (
                <span className="font-mono text-xs">
                    {row.original.ip_address || '-'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Detalhes',
            cell: ({ row }) => (
                <Button variant="ghost" size="sm" onClick={() => setSelectedLog(row.original)}>
                    <Eye className="h-4 w-4" />
                </Button>
            ),
        },
    ];

    const formatJsonData = (data: Record<string, unknown> | null | undefined) => {
        if (!data) return 'Sem dados';
        try {
            return JSON.stringify(data, null, 2);
        } catch {
            return 'Erro ao formatar dados';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Logs de Auditoria</h1>
                <p className="text-muted-foreground">
                    Histórico de todas as ações realizadas no sistema
                </p>
            </div>

            <DataTable 
                columns={columns} 
                data={auditLogs} 
                loading={loading}
            />

            <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedLog && getEntityIcon(selectedLog.entidade)}
                            Detalhes do Log
                        </DialogTitle>
                        <DialogDescription>
                            {selectedLog?.created_at && 
                                formatDistanceToNow(new Date(selectedLog.created_at), { 
                                    addSuffix: true, 
                                    locale: pt 
                                })
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="h-[50vh] pr-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Ação</label>
                                    <div className="mt-1">{selectedLog && getActionBadge(selectedLog.acao)}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Entidade</label>
                                    <p className="mt-1 capitalize">{selectedLog?.entidade}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">ID da Entidade</label>
                                    <p className="mt-1 font-mono text-sm">{selectedLog?.entidade_id || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">ID do Utilizador</label>
                                    <p className="mt-1 font-mono text-sm">{selectedLog?.utilizador_id?.slice(0, 8) || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                                    <p className="mt-1 font-mono text-sm">{selectedLog?.ip_address || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Data/Hora</label>
                                    <p className="mt-1 text-sm">
                                        {selectedLog?.created_at 
                                            ? new Date(selectedLog.created_at).toLocaleString('pt-AO')
                                            : '-'
                                        }
                                    </p>
                                </div>
                            </div>

                            {selectedLog?.user_agent && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                                    <p className="mt-1 text-xs text-muted-foreground break-all">
                                        {selectedLog.user_agent}
                                    </p>
                                </div>
                            )}

                            <Separator />

                            {selectedLog?.dados_anteriores && Object.keys(selectedLog.dados_anteriores).length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Dados Anteriores</label>
                                    <pre className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-xs overflow-x-auto">
                                        {formatJsonData(selectedLog.dados_anteriores)}
                                    </pre>
                                </div>
                            )}

                            {selectedLog?.dados_novos && Object.keys(selectedLog.dados_novos).length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Dados Novos</label>
                                    <pre className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md text-xs overflow-x-auto">
                                        {formatJsonData(selectedLog.dados_novos)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
