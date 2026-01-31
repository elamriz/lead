"use client";

import { Product } from "@/lib/data";
import { useCartStore } from "@/store/cartStore";
import { Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const ProductCard = ({ product }: { product: Product }) => {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full border border-black/5">
            {/* Image Area */}
            <Link href={`/shop/${product.id}`} className="relative aspect-[4/3] w-full bg-[#fbfbfd] overflow-hidden block">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-300 font-bold text-lg bg-neutral-50">
                        {product.category}
                    </div>
                )}

                {/* Badges */}
                {product.isNew && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                        New
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <div className="mb-2">
                    <p className="text-xs font-semibold text-orange-600 mb-1 uppercase tracking-wide">
                        {product.category}
                    </p>
                    <Link href={`/shop/${product.id}`}>
                        <h3 className="text-lg font-semibold text-[#1d1d1f] leading-snug group-hover:text-blue-600 transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold text-[#1d1d1f]">
                            {product.price}€
                        </span>
                        {product.originalPrice && (
                            <span className="text-xs text-neutral-400 line-through">
                                {product.originalPrice}€
                            </span>
                        )}
                    </div>

                    <button
                        onClick={() => addItem(product)}
                        className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-black hover:text-white transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
