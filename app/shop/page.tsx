"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/shop/ProductCard";
import { Product, products as staticProducts } from "@/lib/data";
import { useSearchParams, useRouter } from "next/navigation";

// Component to handle search params
function ShopContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get filter from URL, default to "All"
    const currentFilter = searchParams.get("category") || "All";

    const categories = [
        { id: "All", label: "All Products" },
        { id: "PC", label: "Computers" },
        { id: "Laptop", label: "Laptops" },
        { id: "Component", label: "Components" },
        { id: "Accessory", label: "Accessories" }
    ];

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

    const searchQuery = searchParams.get("q") || "";

    const filteredProducts = products.filter(p => {
        const matchesCategory = currentFilter === "All" || p.category === currentFilter;
        const matchesSearch = searchQuery === "" ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const handleFilterChange = (categoryId: string) => {
        if (categoryId === "All") {
            router.push("/shop");
        } else {
            router.push(`/shop?category=${categoryId}`);
        }
    };

    return (
        <div className="container-wide py-12">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-[#1d1d1f]">
                    Shop {currentFilter === "All" ? "All" : currentFilter === "PC" ? "Computers" : currentFilter + "s"}
                </h1>
                <p className="text-neutral-500 max-w-2xl mx-auto text-lg text-balance">
                    Browse our collection of premium refurbished hardware.
                </p>

                {/* Dev Seed Button */}
                <button
                    onClick={async () => {
                        const res = await fetch('/api/seed');
                        if (res.ok) window.location.reload();
                    }}
                    className="mt-4 text-xs text-neutral-300 hover:text-neutral-500 transition-colors"
                >
                    Refresh Catalog DB
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-16 sticky top-20 z-30 bg-white/80 backdrop-blur-md py-4 transition-all">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleFilterChange(cat.id)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${currentFilter === cat.id
                            ? "bg-[#1d1d1f] text-white shadow-lg scale-105"
                            : "bg-[#f5f5f7] text-neutral-600 hover:bg-[#e5e5e7] hover:text-black"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-32">
                    <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-neutral-400 text-lg">No products found in this category.</p>
                    <button
                        onClick={() => handleFilterChange("All")}
                        className="mt-4 text-[#0071e3] hover:underline"
                    >
                        View all products
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-white pt-24">
            <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
                <ShopContent />
            </Suspense>
        </main>
    );
}
