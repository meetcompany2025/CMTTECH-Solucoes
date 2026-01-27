import { ScaleLoader } from "react-spinners";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    loading?: boolean;
    className?: string; // Wrapper className
}

export function LoadingSpinner({
    loading = true,
    className
}: LoadingSpinnerProps) {
    if (!loading) return null;

    return (
        <div className={cn("flex h-full w-full items-center justify-center min-h-[200px]", className)}>
            <ScaleLoader color="#666" loading={loading} />
        </div>
    );
}
