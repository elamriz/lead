"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { GlassButton } from "@/components/ui/GlassButton";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

function StatusContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [status, setStatus] = useState<"loading" | "paid" | "pending" | "failed" | "canceled">("loading");
    const clearCart = useCartStore((state) => state.clearCart);

    useEffect(() => {
        if (!orderId) {
            setStatus("failed");
            return;
        }

        const checkStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('status')
                    .eq('id', orderId)
                    .single();

                if (error || !data) {
                    throw new Error("Order not found");
                }

                setStatus(data.status as any);

                if (data.status === 'paid') {
                    clearCart();
                }
            } catch (error) {
                console.error("Error fetching status:", error);
                setStatus("failed"); // Or keep loading if we want to retry
            }
        };

        // Poll for a few seconds if pending? Or just check once.
        checkStatus();
        const interval = setInterval(checkStatus, 3000); // Poll every 3s

        return () => clearInterval(interval);
    }, [orderId, clearCart]);

    if (status === "loading" || status === "pending") {
        return (
            <div className="text-center">
                <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-white mb-4">Processing Payment...</h1>
                <p className="text-white/60">Please wait while we confirm your transaction.</p>
            </div>
        );
    }

    if (status === "paid") {
        return (
            <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 mx-auto text-green-400">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
                <p className="text-white/60 mb-8">Thank you for your order. We have received your payment.</p>
                <Link href="/shop">
                    <GlassButton>Continue Shopping</GlassButton>
                </Link>
            </div>
        );
    }

    return (
        <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 mx-auto text-red-400">
                <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Payment {status === 'canceled' ? 'Canceled' : 'Failed'}</h1>
            <p className="text-white/60 mb-8">Something went wrong or the payment was canceled. Please try again.</p>
            <Link href="/checkout">
                <GlassButton variant="secondary">Try Again</GlassButton>
            </Link>
        </div>
    );
}

export default function PaymentStatusPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6">
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <StatusContent />
            </Suspense>
        </main>
    );
}
