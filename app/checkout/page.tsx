"use client";

import { useCartStore } from "@/store/cartStore";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
    const { items, totalPrice } = useCartStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);

        const formData = new FormData(e.target as HTMLFormElement);
        const customerDetails = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            apartment: formData.get('apartment'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            country: formData.get('country'),
        };

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, customerDetails }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Something went wrong');

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error("No checkout URL received");
            }
        } catch (err: any) {
            console.error("Checkout submission error:", err);
            setError(err.message);
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#f5f5f7]">
                <h1 className="text-2xl font-semibold text-[#1d1d1f] mb-4">Your bag is empty.</h1>
                <Link href="/shop" className="text-[#0071e3] hover:underline">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f5f5f7] py-12 md:py-24">
            <div className="container-wide max-w-6xl mx-auto">
                <div className="flex items-center gap-2 mb-8 text-[#1d1d1f]">
                    <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left: Form */}
                    <div className="lg:col-span-7 space-y-8">

                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">

                            {/* Section: Contact */}
                            <section className="bg-white rounded-2xl p-8 border border-neutral-200">
                                <h2 className="text-lg font-semibold text-[#1d1d1f] mb-6">Contact Information</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="First Name" name="firstName" required />
                                        <InputGroup label="Last Name" name="lastName" required />
                                    </div>
                                    <InputGroup label="Email Address" type="email" name="email" required />
                                    <InputGroup label="Phone Number" type="tel" name="phone" required />
                                </div>
                            </section>

                            {/* Section: Shipping */}
                            <section className="bg-white rounded-2xl p-8 border border-neutral-200">
                                <h2 className="text-lg font-semibold text-[#1d1d1f] mb-6">Shipping Address</h2>
                                <div className="space-y-4">
                                    <InputGroup label="Address" name="address" required />
                                    <InputGroup label="Apartment, suite, etc. (optional)" name="apartment" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Postal Code" name="postalCode" required />
                                        <InputGroup label="City" name="city" required />
                                    </div>
                                    <InputGroup label="Country" name="country" required />
                                </div>
                            </section>



                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
                                    <span className="font-bold">Error:</span> {error}
                                </div>
                            )}

                        </form>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white rounded-2xl p-8 border border-neutral-200">
                                <h2 className="text-lg font-semibold text-[#1d1d1f] mb-6">Order Summary</h2>

                                <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-16 h-16 bg-[#f5f5f7] rounded-lg overflow-hidden flex-shrink-0 border border-neutral-100">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">IMG</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-[#1d1d1f] line-clamp-2">{item.name}</h4>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                                                    <p className="text-sm font-medium text-[#1d1d1f]">{(item.price * item.quantity).toFixed(2)}€</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-6 border-t border-neutral-100">
                                    <div className="flex justify-between text-neutral-500 text-sm">
                                        <span>Subtotal</span>
                                        <span>{totalPrice().toFixed(2)}€</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-500 text-sm">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-[#1d1d1f] text-lg font-semibold pt-2">
                                        <span>Total</span>
                                        <span>{totalPrice().toFixed(2)}€</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={isProcessing}
                                    className="w-full mt-8 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium py-4 rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>Processing... <Loader2 className="w-4 h-4 animate-spin" /></>
                                    ) : (
                                        <>Pay Securely <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>

                                <p className="text-xs text-center text-neutral-400 mt-4">
                                    By clicking pay, you agree to our Terms & Conditions.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-neutral-200 flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-[#1d1d1f] text-sm">Elamriz Guarantee</h4>
                                    <p className="text-xs text-neutral-500">30-day returns & 12-month warranty included.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}

function InputGroup({ label, name, type = "text", required = false }: { label: string, name: string, type?: string, required?: boolean }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide ml-1">{label}</label>
            <input
                name={name}
                type={type}
                required={required}
                className="w-full bg-[#f5f5f7] border border-neutral-200 rounded-xl px-4 py-3 text-[#1d1d1f] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all"
                placeholder={label}
            />
        </div>
    );
}
