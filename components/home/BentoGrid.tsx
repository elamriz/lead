"use client";

import { products } from "@/lib/data";
import { ProductCard } from "@/components/shop/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const BentoGrid = () => {
    // Determine layout items
    const featured = products[0]; // Hero item
    const subItems = products.slice(1, 4);

    if (!featured) return null;

    return (
        <section className="py-24 bg-[#f5f5f7]">
            <div className="container-wide">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f]">
                        The Collection.
                    </h2>
                    <Link href="/shop" className="flex items-center gap-1 text-blue-600 hover:underline font-medium">
                        See all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {/* Main Featured Item - Spans 2 cols on desktop if we had more items, 
                        but for a 3-item row usually 1x1x1 is standard. 
                        Let's try a 2-col span for the first item for "Bento" feel. */}

                    <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-white min-h-[400px] border border-black/5 shadow-sm transition-all hover:shadow-xl">
                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                            <span className="text-orange-600 font-bold uppercase tracking-wider text-sm mb-2">{featured.category}</span>
                            <h3 className="text-3xl font-bold text-black mb-2">{featured.name}</h3>
                            <p className="text-neutral-600 max-w-md mb-6">{featured.description}</p>
                            <Link href={`/shop/${featured.id}`} className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full w-fit hover:scale-105 transition-transform">
                                Buy Now <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none" />

                        {/* Image Background */}
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                            {/* Placeholder for large product image */}
                            <div className="w-2/3 h-2/3 bg-neutral-200 rounded-xl" />
                        </div>
                    </div>

                    {/* Side Stack */}
                    <div className="flex flex-col gap-6 md:gap-8">
                        {subItems.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
