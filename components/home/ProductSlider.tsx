"use client";

import { Product } from "@/lib/data";
import { ProductCard } from "@/components/shop/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductSliderProps {
    title: string;
    products: Product[];
    link?: string;
}

export const ProductSlider = ({ title, products, link = "/shop" }: ProductSliderProps) => {
    return (
        <section className="py-10 border-b border-neutral-100">
            <div className="container-wide">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                        {title}
                    </h2>
                    <Link href={link} className="flex items-center gap-1 text-[#0071e3] hover:underline text-sm font-medium">
                        See all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-8 -mx-6 px-6 scrollbar-hide snap-x">
                    {products.map((product) => (
                        <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start h-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
