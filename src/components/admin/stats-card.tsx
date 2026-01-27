import { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: { value: number; positive: boolean };
    description?: ReactNode;
}

export function StatsCard({ title, value, icon, trend, description }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <div className="h-8 w-8 text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {trend && (
                    <p className={`text-xs flex items-center gap-1 mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.positive ? (
                            <ArrowUpIcon className="h-3 w-3" />
                        ) : (
                            <ArrowDownIcon className="h-3 w-3" />
                        )}
                        <span>{Math.abs(trend.value)}%</span>
                    </p>
                )}
                {description && (
                    <div className="text-xs text-muted-foreground mt-1">{description}</div>
                )}
            </CardContent>
        </Card>
    );
}
