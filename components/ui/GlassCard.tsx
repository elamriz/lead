import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hoverEffect?: boolean;
}

export const GlassCard = ({ children, className, hoverEffect = false, ...props }: GlassCardProps) => {
    return (
        <div
            className={cn(
                "glass rounded-2xl p-6 transition-all duration-300",
                hoverEffect && "glass-hover cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
