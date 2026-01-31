"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Hero = () => {
    const router = useRouter();
    const [search, setSearch] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            // For now just go to shop, eventually implement search param
            router.push(`/shop?category=All`);
        }
    };

    return (
        <section className="relative w-full pt-32 pb-16 bg-[#f5f5f7]">
            <div className="container-wide flex flex-col items-center text-center">

                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-6">
                    Find your next upgrade.
                </h1>

                <p className="text-lg text-neutral-500 mb-10 max-w-lg mx-auto">
                    The marketplace for premium refurbished hardware. Verified quality, warranty included.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="w-full max-w-xl relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-neutral-400 group-focus-within:text-[#0071e3] transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for RTX 4090, MacBook Pro, accessories..."
                        className="w-full h-14 pl-12 pr-4 rounded-full bg-white border border-neutral-200 shadow-sm text-lg focus:outline-none focus:ring-4 focus:ring-[#0071e3]/10 focus:border-[#0071e3] transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 px-6 bg-[#0071e3] text-white rounded-full text-sm font-medium hover:bg-[#0077ed] transition-colors"
                    >
                        Search
                    </button>
                </form>

            </div>
        </section>
    );
};
