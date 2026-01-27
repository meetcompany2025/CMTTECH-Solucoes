import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/admin/data-table';
import { SystemSettingRepository } from '@/data/repositories/setting.repository.impl';
import { SystemSetting } from '@/domain/entities/setting.entity';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';

const settingRepository = new SystemSettingRepository();

export default function SettingsList() {
    const [settings, setSettings] = useState<SystemSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const data = await settingRepository.getAll();
            setSettings(data);
        } catch (error) {
            toast.error('Falha ao carregar configurações');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (setting: SystemSetting) => {
        setEditingSetting(setting);
        setEditValue(setting.valor || '');
    };

    const handleSave = async () => {
        if (!editingSetting) return;

        try {
            await settingRepository.update(editingSetting.chave, {
                valor: editValue === '' ? null : editValue
            });

            toast.success('Configuração atualizada');
            setEditingSetting(null);
            loadSettings();
        } catch (error) {
            toast.error('Falha ao atualizar configuração');
        }
    };

    const columns: ColumnDef<SystemSetting>[] = [
        {
            accessorKey: 'chave',
            header: 'Chave',
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.chave}</span>,
        },
        {
            accessorKey: 'grupo',
            header: 'Grupo',
        },
        {
            accessorKey: 'descricao',
            header: 'Descrição',
        },
        {
            accessorKey: 'valor',
            header: 'Valor',
            cell: ({ row }) => {
                const { tipo, valor } = row.original;
                if (tipo === 'boolean') {
                    return valor === 'true' ? 'Ativado' : 'Desativado';
                }
                return <span className="max-w-[200px] truncate block" title={valor || ''}>{valor}</span>;
            },
        },
        {
            id: 'actions',
            header: 'Ações',
            cell: ({ row }) => {
                if (!row.original.editavel) return <span className="text-muted-foreground text-xs">Sistema</span>;

                return (
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
                <p className="text-muted-foreground">Gerir parâmetros globais da aplicação</p>
            </div>

            <DataTable columns={columns} data={settings} loading={loading} />

            <Dialog open={!!editingSetting} onOpenChange={(open) => !open && setEditingSetting(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Configuração</DialogTitle>
                        <DialogDescription>
                            {editingSetting?.descricao}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="key" className="text-right">Chave</Label>
                            <Input id="key" value={editingSetting?.chave} disabled className="col-span-3 bg-muted" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="value" className="text-right">Valor</Label>
                            {editingSetting?.tipo === 'boolean' ? (
                                <div className="col-span-3 flex items-center space-x-2">
                                    <Switch
                                        checked={editValue === 'true'}
                                        onCheckedChange={(checked) => setEditValue(checked ? 'true' : 'false')}
                                    />
                                    <span>{editValue === 'true' ? 'Ativado' : 'Desativado'}</span>
                                </div>
                            ) : (
                                <Input
                                    id="value"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="col-span-3"
                                    type={editingSetting?.tipo === 'number' ? 'number' : 'text'}
                                />
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingSetting(null)}>Cancelar</Button>
                        <Button onClick={handleSave}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
