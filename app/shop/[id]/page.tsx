"use client";

import { useCartStore } from "@/store/cartStore";
import { Check, ChevronRight, Package, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/data";

export default function ProductPage() {
    const params = useParams();
    const id = params?.id as string;
    const addItem = useCartStore((state) => state.addItem);
    const [added, setAdded] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            if (!id) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    setProduct(null);
                } else {
                    const mappedProduct: Product = {
                        id: data.id,
                        name: data.name,
                        category: data.category,
                        price: data.price,
                        originalPrice: data.original_price,
                        image: data.image,
                        description: data.description,
                        specs: data.specs || {},
                        isNew: data.is_new
                    };
                    setProduct(mappedProduct);
                }
            } catch (error) {
                console.error("Error:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addItem(product);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-[#86868b] border-t-[#1d1d1f] rounded-full animate-spin"></div>
                    <p className="text-[#86868b] text-sm font-medium animate-pulse">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl font-semibold text-[#1d1d1f] mb-2">Product Not Found</h1>
                <p className="text-[#86868b] mb-8">The product you're looking for doesn't exist or has been removed.</p>
                <Link
                    href="/shop"
                    className="px-6 py-2 bg-[#0071e3] text-white rounded-full text-sm font-medium hover:bg-[#0077ed] transition-colors"
                >
                    Return to Store
                </Link>
            </div>
        );
    }

    // Calculate discount percentage if original price exists
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <main className="min-h-screen bg-[#f5f5f7] pt-24">
            {/* Breadcrumb / Top Nav */}
            <nav className="sticky top-20 z-30 bg-[#f5f5f7]/80 backdrop-blur-md border-b border-[#d2d2d7]/30">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#1d1d1f]">
                        <Link href="/shop" className="hover:text-[#0071e3] transition-colors">Store</Link>
                        <ChevronRight className="w-3 h-3 text-[#86868b]" />
                        <span className="text-[#86868b]">{product.category}</span>
                        <ChevronRight className="w-3 h-3 text-[#86868b]" />
                        <span className="truncate max-w-[200px]">{product.name}</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                    {/* Left Column: Product Image (Sticky) */}
                    <div className="flex-1 lg:min-w-[50%]">
                        <div className="lg:sticky lg:top-40 space-y-6">
                            <div className="relative aspect-square w-full rounded-[2.5rem] bg-white shadow-sm overflow-hidden group">
                                {product.isNew && (
                                    <div className="absolute top-6 left-6 z-10 px-3 py-1 bg-[#1d1d1f] text-white text-[10px] font-bold tracking-widest uppercase rounded-full">
                                        New
                                    </div>
                                )}

                                {product.image ? (
                                    <div className="w-full h-full flex items-center justify-center bg-white p-8">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#f5f5f7] text-[#86868b]">
                                        No Image Available
                                    </div>
                                )}
                            </div>

                            {/* Value Propositions */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl text-center gap-2">
                                    <Truck className="w-5 h-5 text-[#0071e3]" />
                                    <span className="text-[10px] font-medium text-[#1d1d1f]">Free Delivery</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl text-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-[#0071e3]" />
                                    <span className="text-[10px] font-medium text-[#1d1d1f]">2 Year Warranty</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl text-center gap-2">
                                    <Package className="w-5 h-5 text-[#0071e3]" />
                                    <span className="text-[10px] font-medium text-[#1d1d1f]">Success Return</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="flex-1 flex flex-col pt-4">
                        <div className="mb-2">
                            <span className="text-[#bf4800] text-sm font-semibold tracking-wide uppercase">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-6 leading-[1.1]">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-4 mb-8">
                            <span className="text-3xl font-semibold text-[#1d1d1f]">
                                {product.price.toLocaleString()}€
                            </span>
                            {product.originalPrice && (
                                <>
                                    <span className="text-xl text-[#86868b] line-through">
                                        {product.originalPrice.toLocaleString()}€
                                    </span>
                                    <span className="px-2 py-1 bg-[#0071e3]/10 text-[#0071e3] text-xs font-semibold rounded-md">
                                        Save {discount}%
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="prose prose-lg text-[#86868b] leading-relaxed mb-10">
                            <p>{product.description}</p>
                        </div>

                        {/* Specs Grid */}
                        <div className="bg-white rounded-3xl p-8 mb-10 shadow-sm">
                            <h3 className="text-lg font-semibold text-[#1d1d1f] mb-6">Specifications</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                                {Object.entries(product.specs).map(([key, value]) => (
                                    <div key={key} className="border-b border-[#d2d2d7]/30 pb-4 last:border-0 last:pb-0 sm:last:border-b sm:last:pb-4 [&:nth-last-child(-n+2)]:border-0 [&:nth-last-child(-n+2)]:pb-0">
                                        <div className="text-xs font-medium text-[#86868b] uppercase tracking-wide mb-1">
                                            {key}
                                        </div>
                                        <div className="text-[#1d1d1f] font-medium">
                                            {value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="mt-auto pt-8 border-t border-[#d2d2d7]">
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className={`
                                        w-full py-4 px-8 rounded-full text-lg font-medium transition-all duration-300 transform
                                        flex items-center justify-center gap-3
                                        ${added
                                            ? "bg-[#28cd41] text-white scale-95"
                                            : "bg-[#0071e3] text-white hover:bg-[#0077ed] active:scale-95 shadow-lg shadow-[#0071e3]/20"
                                        }
                                    `}
                                >
                                    {added ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Added to Bag
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-5 h-5" />
                                            Add to Bag
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-xs text-[#86868b]">
                                    Free shipping on all orders. Returns valid for 14 days.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

