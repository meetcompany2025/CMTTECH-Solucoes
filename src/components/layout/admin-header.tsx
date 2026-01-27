import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AdminHeaderProps {
    sidebarCollapsed: boolean;
}

const routeNames: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/products': 'Produtos',
    '/admin/products/new': 'Novo Produto',
    '/admin/categories': 'Categorias',
    '/admin/categories/new': 'Nova Categoria',
    '/admin/orders': 'Encomendas',
    '/admin/payments': 'Pagamentos',
    '/admin/stock': 'Gestão de Stock',
    '/admin/stock/alerts': 'Alertas de Stock',
    '/admin/stock/alerts/new': 'Novo Alerta',
    '/admin/customers': 'Clientes',
    '/admin/settings': 'Configurações',
    '/admin/profile': 'O Meu Perfil',
};

export function AdminHeader({ sidebarCollapsed }: AdminHeaderProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const getBreadcrumbs = () => {
        const path = location.pathname;
        const segments = path.split('/').filter(Boolean);
        const breadcrumbs: { name: string; path: string }[] = [];

        segments.forEach((segment, index) => {
            const currentPath = '/' + segments.slice(0, index + 1).join('/');

            // Handle dynamic IDs in product/category/stock/customer paths
            let name = routeNames[currentPath];

            if (!name) {
                if (currentPath.includes('/products/') && currentPath.endsWith('/edit')) {
                    name = 'Editar';
                } else if (currentPath.includes('/categories/') && currentPath.endsWith('/edit')) {
                    name = 'Editar';
                } else if (currentPath.includes('/stock/alerts/') && !currentPath.endsWith('/new')) {
                    name = 'Editar Alerta';
                } else if (currentPath.includes('/orders/')) {
                    name = 'Detalhes';
                } else if (currentPath.includes('/customers/')) {
                    name = 'Detalhes';
                } else {
                    name = segment.charAt(0).toUpperCase() + segment.slice(1);
                }
            }

            breadcrumbs.push({ name, path: currentPath });
        });

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header
            className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6"
        >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.path} className="flex items-center gap-2">
                        {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        <button
                            onClick={() => index !== breadcrumbs.length - 1 && navigate(crumb.path)}
                            className={
                                index === breadcrumbs.length - 1
                                    ? 'font-medium cursor-default'
                                    : 'text-muted-foreground hover:text-foreground transition-colors'
                            }
                        >
                            {crumb.name}
                        </button>
                    </div>
                ))}
            </div>

            {/* User Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar>
                            <AvatarImage src={user?.avatar_url || undefined} alt={user?.username} />
                            <AvatarFallback>
                                {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">{user?.username}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                        O Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                        Configurações
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => (window.location.href = '/')}>
                        Ver Site
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut} className="text-destructive">
                        Terminar Sessão
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
