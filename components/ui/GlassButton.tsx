import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
    ({ className, variant = "primary", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "relative px-6 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 flex items-center justify-center gap-2",
                    // Variants
                    variant === "primary" && "bg-gradient-to-r from-blue-600/30 to-indigo-700/30 border border-blue-500/30 text-blue-50 hover:from-blue-500/40 hover:to-indigo-600/40 hover:border-blue-400/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]",
                    variant === "secondary" && "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
                    variant === "outline" && "border border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-transparent",
                    className
                )}
                {...props}
            />
        );
    }
);
GlassButton.displayName = "GlassButton";
