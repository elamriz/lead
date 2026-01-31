import { ShieldCheck, CreditCard, Banknote, Smartphone } from "lucide-react";

export const MollieBadge = ({ className }: { className?: string }) => {
    return (
        <div className={`rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 border border-neutral-200 bg-white/50 backdrop-blur-sm ${className || ''}`}>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                    <span className="block text-xs font-bold tracking-wider text-neutral-400 uppercase">Secured by</span>
                    <span className="block text-sm font-semibold text-neutral-900">Mollie Payments</span>
                </div>
            </div>

            <div className="h-px w-full md:w-px md:h-10 bg-neutral-200" />

            <div className="flex gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex flex-col items-center gap-1">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-[10px] uppercase font-medium">Card</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Banknote className="w-5 h-5" />
                    <span className="text-[10px] uppercase font-medium">Cash</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Smartphone className="w-5 h-5" />
                    <span className="text-[10px] uppercase font-medium">App</span>
                </div>
            </div>
        </div>
    );
};
