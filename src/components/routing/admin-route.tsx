import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
    element: ReactElement;
    allowedRoles?: string[];
}

export function AdminRoute({ element, allowedRoles = ['ADMIN', 'SUPER_ADMIN'] }: AdminRouteProps) {
    const { user, loading } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
        return <LoadingSpinner className="min-h-screen" />;
    }

    // Redirect to login if user is not authenticated
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // Check if user has admin role
    const hasAdminRole = allowedRoles.includes(user.role);

    // Redirect to home if user is not an admin
    if (!hasAdminRole) {
        return <Navigate to="/" replace />;
    }

    // Render the protected admin component
    return element;
}
