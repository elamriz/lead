"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/home/Hero";
import { CategoryRail } from "@/components/home/CategoryRail";
import { ProductSlider } from "@/components/home/ProductSlider";
import { TrustSection } from "@/components/home/TrustSection";
import { supabase } from "@/lib/supabase";
import { Product, products as staticProducts } from "@/lib/data";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*');

                if (error) {
                    throw error;
                }

                if (!data || data.length === 0) {
                    console.log("No data from DB, using static fallback.");
                    setProducts(staticProducts);
                    return;
                }

                const mappedProducts: Product[] = data.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    price: p.price,
                    originalPrice: p.original_price,
                    image: p.image,
                    description: p.description,
                    specs: p.specs || {},
                    isNew: p.is_new
                }));

                setProducts(mappedProducts);
            } catch (error) {
                console.error("Error fetching products, using fallback:", error);
                setProducts(staticProducts);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    // Filter products by category
    const laptops = products.filter(p => p.category === "Laptop");
    const trending = products.slice(0, 5);
    const components = products.filter(p => p.category === "Component" || p.category === "Accessory");

    if (loading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                    <p className="text-neutral-500 text-sm">Loading products...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <Hero />
            <CategoryRail />

            <div className="py-4">
                <ProductSlider title="Best Sellers" products={trending} />
                <ProductSlider title="Laptops & Portables" products={laptops} link="/shop?category=Laptop" />
                <ProductSlider title="Components & Gear" products={components} link="/shop?category=Component" />
            </div>

            <TrustSection />
        </main>
    );
}
