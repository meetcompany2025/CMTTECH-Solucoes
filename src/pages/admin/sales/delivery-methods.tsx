import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Truck, Check, X } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { toast } from 'sonner';
import { DeliveryMethodRepository } from '@/data/repositories/delivery-method.repository.impl';
import { DeliveryMethod } from '@/domain/entities/delivery-method.entity';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const deliveryMethodRepository = new DeliveryMethodRepository();

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);

export default function DeliveryMethodsList() {
    const [methods, setMethods] = useState<DeliveryMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [methodToDelete, setMethodToDelete] = useState<DeliveryMethod | null>(null);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [editingMethod, setEditingMethod] = useState<DeliveryMethod | null>(null);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        tipo: 'standard',
        custo: 0,
        custo_extra_kg: 0,
        tempo_estimado_dias: 0,
        activo: true,
    });

    useEffect(() => {
        loadMethods();
    }, []);

    const loadMethods = async () => {
        try {
            setLoading(true);
            const data = await deliveryMethodRepository.getAll({ limit: 100 });
            setMethods(data);
        } catch (error) {
            toast.error('Falha ao carregar métodos de entrega');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!methodToDelete) return;

        try {
            await deliveryMethodRepository.delete(methodToDelete.id);
            toast.success('Método de entrega eliminado com sucesso');
            loadMethods();
        } catch (error) {
            toast.error('Falha ao eliminar método de entrega');
        } finally {
            setDeleteDialogOpen(false);
            setMethodToDelete(null);
        }
    };

    const openCreateDialog = () => {
        setEditingMethod(null);
        setFormData({
            nome: '',
            descricao: '',
            tipo: 'standard',
            custo: 0,
            custo_extra_kg: 0,
            tempo_estimado_dias: 0,
            activo: true,
        });
        setFormDialogOpen(true);
    };

    const openEditDialog = (method: DeliveryMethod) => {
        setEditingMethod(method);
        setFormData({
            nome: method.nome,
            descricao: method.descricao || '',
            tipo: method.tipo,
            custo: method.custo,
            custo_extra_kg: method.custo_extra_kg,
            tempo_estimado_dias: method.tempo_estimado_dias,
            activo: method.activo,
        });
        setFormDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (editingMethod) {
                await deliveryMethodRepository.update(editingMethod.id, formData);
                toast.success('Método de entrega atualizado com sucesso');
            } else {
                await deliveryMethodRepository.create(formData);
                toast.success('Método de entrega criado com sucesso');
            }
            setFormDialogOpen(false);
            loadMethods();
        } catch (error) {
            toast.error('Falha ao salvar método de entrega');
        }
    };

    const filteredMethods = methods.filter((method) =>
        method.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns: ColumnDef<DeliveryMethod>[] = [
        {
            accessorKey: 'nome',
            header: 'Nome',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{row.original.nome}</span>
                </div>
            ),
        },
        {
            accessorKey: 'tipo',
            header: 'Tipo',
            cell: ({ row }) => (
                <span className="capitalize">{row.original.tipo}</span>
            ),
        },
        {
            accessorKey: 'custo',
            header: 'Custo',
            cell: ({ row }) => formatCurrency(row.original.custo),
        },
        {
            accessorKey: 'tempo_estimado_dias',
            header: 'Tempo (dias)',
            cell: ({ row }) => (
                <span>{row.original.tempo_estimado_dias} dias</span>
            ),
        },
        {
            accessorKey: 'activo',
            header: 'Estado',
            cell: ({ row }) => (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    row.original.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {row.original.activo ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {row.original.activo ? 'Activo' : 'Inactivo'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Ações',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(row.original)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                            setMethodToDelete(row.original);
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Métodos de Entrega</h1>
                    <p className="text-muted-foreground">Gerir métodos de entrega disponíveis</p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Método
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Pesquisar métodos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredMethods}
                loading={loading}
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                onCancel={() => setDeleteDialogOpen(false)}
                title="Eliminar Método de Entrega"
                description={`Tem a certeza que deseja eliminar "${methodToDelete?.nome}"? Esta ação não pode ser revertida.`}
                onConfirm={handleDelete}
            />

            <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingMethod ? 'Editar Método de Entrega' : 'Novo Método de Entrega'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingMethod ? 'Atualize os dados do método de entrega.' : 'Preencha os dados do novo método de entrega.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome *</Label>
                            <Input
                                id="nome"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                placeholder="Ex: Entrega Expressa"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição</Label>
                            <Textarea
                                id="descricao"
                                value={formData.descricao}
                                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                placeholder="Descrição do método de entrega"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tipo">Tipo</Label>
                                <Select
                                    value={formData.tipo}
                                    onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="standard">Standard</SelectItem>
                                        <SelectItem value="express">Expresso</SelectItem>
                                        <SelectItem value="pickup">Retirada</SelectItem>
                                        <SelectItem value="same_day">No mesmo dia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tempo">Tempo Estimado (dias)</Label>
                                <Input
                                    id="tempo"
                                    type="number"
                                    min="0"
                                    value={formData.tempo_estimado_dias}
                                    onChange={(e) => setFormData({ ...formData, tempo_estimado_dias: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="custo">Custo (AOA)</Label>
                                <Input
                                    id="custo"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.custo}
                                    onChange={(e) => setFormData({ ...formData, custo: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="custo_extra">Custo Extra/Kg (AOA)</Label>
                                <Input
                                    id="custo_extra"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.custo_extra_kg}
                                    onChange={(e) => setFormData({ ...formData, custo_extra_kg: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="activo"
                                checked={formData.activo}
                                onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                            />
                            <Label htmlFor="activo">Activo</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={!formData.nome}>
                            {editingMethod ? 'Atualizar' : 'Criar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
