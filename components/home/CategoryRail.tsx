"use client";

import Link from "next/link";
import { Monitor, Laptop, Zap, Cpu, Mouse } from "lucide-react";

export const CategoryRail = () => {
    const categories = [
        { id: "PC", label: "Computers", icon: <Monitor className="w-6 h-6" /> },
        { id: "Laptop", label: "Laptops", icon: <Laptop className="w-6 h-6" /> },
        { id: "Component", label: "Components", icon: <Cpu className="w-6 h-6" /> },
        { id: "PC", label: "Gaming", icon: <Zap className="w-6 h-6" /> },
        { id: "Accessory", label: "Accessories", icon: <Mouse className="w-6 h-6" /> },
    ];

    return (
        <section className="py-8 border-b border-neutral-100 bg-white">
            <div className="container-wide">
                <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide md:justify-center">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={`/shop?category=${cat.id}`}
                            className="flex flex-col items-center gap-3 min-w-[80px] group cursor-pointer"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#f5f5f7] flex items-center justify-center text-neutral-600 group-hover:bg-black group-hover:text-white transition-all shadow-sm group-hover:shadow-md">
                                {cat.icon}
                            </div>
                            <span className="text-xs font-medium text-neutral-600 group-hover:text-black transition-colors">
                                {cat.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
