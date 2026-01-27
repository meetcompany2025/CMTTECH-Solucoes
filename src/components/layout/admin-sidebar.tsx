import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingCart,
    CreditCard,
    Warehouse,
    ChevronLeft,
    Users,
    Bell,
    Settings,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logo from '@/assets/cmttech-logo.jpg';

interface AdminSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Produtos', href: '/admin/products', icon: Package },
    { name: 'Categorias', href: '/admin/categories', icon: FolderTree },
    { name: 'Stock', href: '/admin/stock', icon: Warehouse, end: true },
    { name: 'Alertas', href: '/admin/stock/alerts', icon: Bell },
    { name: 'Encomendas', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Pagamentos', href: '/admin/payments', icon: CreditCard },
    { name: 'Clientes', href: '/admin/customers', icon: Users },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
    { name: 'Perfil', href: '/admin/profile', icon: User },
];

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen transition-all duration-300 bg-card border-r border-border',
                collapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Header */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-border">
                <div className="flex items-center gap-2 overflow-hidden">
                    <img src={logo} alt="CMTTECH" className="h-8 w-8 rounded object-cover flex-shrink-0" />
                    {!collapsed && <h1 className="text-lg font-semibold truncate text-primary">CMTTECH</h1>}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                    className={cn(collapsed && 'mx-auto')}
                >
                    <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
                </Button>
            </div>

            {/* Navigation */}
            <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        end={item.end}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                collapsed && 'justify-center'
                            )
                        }
                    >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
