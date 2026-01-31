"use client";

import { Shield, RefreshCw, Truck } from "lucide-react";

export const TrustSection = () => {
    return (
        <section className="py-24 bg-white border-t border-neutral-100">
            <div className="container-wide">

                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] mb-6">
                        The Elamriz Standard.
                    </h2>
                    <p className="text-xl text-neutral-500 leading-relaxed text-balance">
                        Buying used shouldn't feel like a gamble. We've introduced a rigorous certification process to ensure every component performs like new.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <TrustItem
                        icon={<RefreshCw className="w-6 h-6" />}
                        title="Certified Refurbished"
                        description="Every GPU and CPU undergoes ultrasonic cleaning and thermal paste replacement."
                    />
                    <TrustItem
                        icon={<Shield className="w-6 h-6" />}
                        title="12-Month Warranty"
                        description="Complete peace of mind. If anything goes wrong, we replace it instantly."
                    />
                    <TrustItem
                        icon={<Truck className="w-6 h-6" />}
                        title="Express Delivery"
                        description="Order by 4PM for same-day dispatch. Tracked and insured shipping."
                    />
                </div>

            </div>
        </section>
    );
};

const TrustItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] mb-2">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-[#1d1d1f]">{title}</h3>
        <p className="text-neutral-500 leading-relaxed max-w-xs">{description}</p>
    </div>
);
