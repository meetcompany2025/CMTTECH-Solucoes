import { Badge } from '@/components/ui/badge';
import { OrderStatus, PaymentStatus } from '@/domain/entities/order.entity';

interface StatusBadgeProps {
    status: OrderStatus | PaymentStatus | string;
    variant?: 'order' | 'payment' | 'stock';
}

export function StatusBadge({ status, variant = 'order' }: StatusBadgeProps) {
    const getVariant = () => {
        if (variant === 'order') {
            return getOrderVariant(status as OrderStatus);
        }
        if (variant === 'payment') {
            return getPaymentVariant(status as PaymentStatus);
        }
        return getStockVariant(status);
    };

    const getOrderVariant = (orderStatus: OrderStatus) => {
        const variants: Record<OrderStatus, { className: string; label: string }> = {
            'pendente': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pendente' },
            'confirmado': { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Confirmado' },
            'em_processamento': { className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', label: 'Em Processamento' },
            'enviado': { className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', label: 'Enviado' },
            'entregue': { className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Entregue' },
            'cancelado': { className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Cancelado' },
        };
        return variants[orderStatus] || { className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', label: orderStatus };
    };

    const getPaymentVariant = (paymentStatus: PaymentStatus) => {
        const variants: Record<PaymentStatus, { className: string; label: string }> = {
            'pendente': { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pendente' },
            'pago': { className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Pago' },
            'falhado': { className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Falhado' },
            'reembolsado': { className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', label: 'Reembolsado' },
        };
        return variants[paymentStatus] || { className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', label: paymentStatus };
    };

    const getStockVariant = (stockStatus: string) => {
        if (stockStatus === 'baixo') {
            return { className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', label: 'Stock Baixo' };
        }
        if (stockStatus === 'sem_stock') {
            return { className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Sem Stock' };
        }
        if (stockStatus === 'disponivel') {
            return { className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Disponível' };
        }
        return { className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', label: stockStatus };
    };

    const badgeConfig = getVariant();

    return (
        <Badge className={badgeConfig.className} variant="outline">
            {badgeConfig.label}
        </Badge>
    );
}
