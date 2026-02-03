import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Tag, Check, X, Percent, DollarSign, Calendar } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { toast } from 'sonner';
import { CouponRepository } from '@/data/repositories/coupon.repository.impl';
import { Coupon } from '@/domain/entities/coupon.entity';
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

const couponRepository = new CouponRepository();

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value);

const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-AO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export default function CouponsList() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [formData, setFormData] = useState({
        codigo: '',
        tipo: 'percentagem',
        valor: 0,
        valor_minimo_compra: 0,
        limite_uso_total: null as number | null,
        limite_uso_cliente: 1,
        data_inicio: '',
        data_fim: '',
        activo: true,
    });

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {
        try {
            setLoading(true);
            const data = await couponRepository.getAll({ limit: 100 });
            setCoupons(data);
        } catch (error) {
            toast.error('Falha ao carregar cupons');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!couponToDelete) return;

        try {
            await couponRepository.delete(couponToDelete.id);
            toast.success('Cupom eliminado com sucesso');
            loadCoupons();
        } catch (error) {
            toast.error('Falha ao eliminar cupom');
        } finally {
            setDeleteDialogOpen(false);
            setCouponToDelete(null);
        }
    };

    const openCreateDialog = () => {
        setEditingCoupon(null);
        setFormData({
            codigo: '',
            tipo: 'percentagem',
            valor: 0,
            valor_minimo_compra: 0,
            limite_uso_total: null,
            limite_uso_cliente: 1,
            data_inicio: '',
            data_fim: '',
            activo: true,
        });
        setFormDialogOpen(true);
    };

    const openEditDialog = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            codigo: coupon.codigo,
            tipo: coupon.tipo,
            valor: coupon.valor,
            valor_minimo_compra: coupon.valor_minimo_compra || 0,
            limite_uso_total: coupon.limite_uso_total,
            limite_uso_cliente: coupon.limite_uso_cliente,
            data_inicio: coupon.data_inicio ? coupon.data_inicio.split('T')[0] : '',
            data_fim: coupon.data_fim ? coupon.data_fim.split('T')[0] : '',
            activo: coupon.activo,
        });
        setFormDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const submitData = {
                ...formData,
                data_inicio: formData.data_inicio ? new Date(formData.data_inicio).toISOString() : null,
                data_fim: formData.data_fim ? new Date(formData.data_fim).toISOString() : null,
                valor_minimo_compra: formData.valor_minimo_compra || null,
            };
            
            if (editingCoupon) {
                await couponRepository.update(editingCoupon.id, submitData);
                toast.success('Cupom atualizado com sucesso');
            } else {
                await couponRepository.create(submitData);
                toast.success('Cupom criado com sucesso');
            }
            setFormDialogOpen(false);
            loadCoupons();
        } catch (error) {
            toast.error('Falha ao salvar cupom');
        }
    };

    const isExpired = (coupon: Coupon) => {
        if (!coupon.data_fim) return false;
        return new Date(coupon.data_fim) < new Date();
    };

    const isLimitReached = (coupon: Coupon) => {
        if (!coupon.limite_uso_total) return false;
        return coupon.usos_actuais >= coupon.limite_uso_total;
    };

    const filteredCoupons = coupons.filter((coupon) =>
        coupon.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns: ColumnDef<Coupon>[] = [
        {
            accessorKey: 'codigo',
            header: 'Código',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono font-bold">{row.original.codigo}</span>
                </div>
            ),
        },
        {
            accessorKey: 'tipo',
            header: 'Tipo',
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    {row.original.tipo === 'percentagem' ? (
                        <>
                            <Percent className="h-4 w-4 text-blue-500" />
                            <span>Percentagem</span>
                        </>
                    ) : (
                        <>
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span>Valor Fixo</span>
                        </>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'valor',
            header: 'Desconto',
            cell: ({ row }) => (
                <span className="font-semibold text-green-600">
                    {row.original.tipo === 'percentagem' 
                        ? `${row.original.valor}%`
                        : formatCurrency(row.original.valor)
                    }
                </span>
            ),
        },
        {
            accessorKey: 'usos_actuais',
            header: 'Usos',
            cell: ({ row }) => (
                <span>
                    {row.original.usos_actuais}
                    {row.original.limite_uso_total && ` / ${row.original.limite_uso_total}`}
                </span>
            ),
        },
        {
            accessorKey: 'data_fim',
            header: 'Validade',
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className={isExpired(row.original) ? 'text-red-500' : ''}>
                        {row.original.data_fim ? formatDate(row.original.data_fim) : 'Sem limite'}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'activo',
            header: 'Estado',
            cell: ({ row }) => {
                const expired = isExpired(row.original);
                const limitReached = isLimitReached(row.original);
                const isActive = row.original.activo && !expired && !limitReached;
                
                let status = 'Activo';
                let colorClass = 'bg-green-100 text-green-800';
                
                if (!row.original.activo) {
                    status = 'Inactivo';
                    colorClass = 'bg-gray-100 text-gray-800';
                } else if (expired) {
                    status = 'Expirado';
                    colorClass = 'bg-red-100 text-red-800';
                } else if (limitReached) {
                    status = 'Esgotado';
                    colorClass = 'bg-orange-100 text-orange-800';
                }
                
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                        {isActive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {status}
                    </span>
                );
            },
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
                            setCouponToDelete(row.original);
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
                    <h1 className="text-2xl font-bold text-foreground">Cupons de Desconto</h1>
                    <p className="text-muted-foreground">Gerir cupons promocionais</p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Cupom
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Pesquisar cupons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredCoupons}
                loading={loading}
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                onCancel={() => setDeleteDialogOpen(false)}
                title="Eliminar Cupom"
                description={`Tem a certeza que deseja eliminar o cupom "${couponToDelete?.codigo}"? Esta ação não pode ser revertida.`}
                onConfirm={handleDelete}
            />

            <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCoupon ? 'Atualize os dados do cupom.' : 'Preencha os dados do novo cupom.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="codigo">Código *</Label>
                            <Input
                                id="codigo"
                                value={formData.codigo}
                                onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                                placeholder="Ex: DESCONTO10"
                                className="font-mono"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tipo">Tipo de Desconto</Label>
                                <Select
                                    value={formData.tipo}
                                    onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentagem">Percentagem (%)</SelectItem>
                                        <SelectItem value="valor_fixo">Valor Fixo (AOA)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="valor">
                                    Valor {formData.tipo === 'percentagem' ? '(%)' : '(AOA)'}
                                </Label>
                                <Input
                                    id="valor"
                                    type="number"
                                    min="0"
                                    max={formData.tipo === 'percentagem' ? 100 : undefined}
                                    step={formData.tipo === 'percentagem' ? 1 : 0.01}
                                    value={formData.valor}
                                    onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="valor_minimo">Valor Mínimo de Compra (AOA)</Label>
                            <Input
                                id="valor_minimo"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.valor_minimo_compra}
                                onChange={(e) => setFormData({ ...formData, valor_minimo_compra: parseFloat(e.target.value) || 0 })}
                                placeholder="0 = sem mínimo"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="limite_total">Limite de Usos Total</Label>
                                <Input
                                    id="limite_total"
                                    type="number"
                                    min="0"
                                    value={formData.limite_uso_total || ''}
                                    onChange={(e) => setFormData({ ...formData, limite_uso_total: e.target.value ? parseInt(e.target.value) : null })}
                                    placeholder="Sem limite"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="limite_cliente">Limite por Cliente</Label>
                                <Input
                                    id="limite_cliente"
                                    type="number"
                                    min="1"
                                    value={formData.limite_uso_cliente}
                                    onChange={(e) => setFormData({ ...formData, limite_uso_cliente: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="data_inicio">Data de Início</Label>
                                <Input
                                    id="data_inicio"
                                    type="date"
                                    value={formData.data_inicio}
                                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="data_fim">Data de Fim</Label>
                                <Input
                                    id="data_fim"
                                    type="date"
                                    value={formData.data_fim}
                                    onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="activo"
                                checked={formData.activo}
                                onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                            />
                            <Label htmlFor="activo">Cupom Activo</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={!formData.codigo || formData.valor <= 0}>
                            {editingCoupon ? 'Atualizar' : 'Criar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
