"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense } from "react";

function NavbarContent() {
    const totalItems = useCartStore((state) => state.totalItems());
    const toggleCart = useCartStore((state) => state.toggleCart);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Search state
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md border-b border-black/5 py-4" : "bg-transparent py-6"
                    }`}
            >
                <div className="container-wide flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-semibold tracking-tight z-50 relative">
                        Elamriz.
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-10 text-sm font-medium text-neutral-600">
                        <Link href="/shop" className="hover:text-black transition-colors">Store</Link>
                        <Link href="/shop?category=PC" className="hover:text-black transition-colors">Computers</Link>
                        <Link href="/shop?category=Component" className="hover:text-black transition-colors">Components</Link>
                        <Link href="/shop?category=Laptop" className="hover:text-black transition-colors">Laptops</Link>
                        <Link href="/shop?category=Accessory" className="hover:text-black transition-colors">Accessories</Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6 z-50 relative">
                        <div className="flex items-center">
                            <AnimatePresence mode="wait">
                                {isSearchOpen ? (
                                    <motion.form
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 200, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        onSubmit={handleSearchSubmit}
                                        className="relative hidden md:flex items-center"
                                    >
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search..."
                                            className="w-full bg-transparent border-b border-neutral-300 py-1 pr-8 text-sm focus:outline-none focus:border-black placeholder:text-neutral-400"
                                            autoFocus
                                            onBlur={() => {
                                                if (!searchQuery) setIsSearchOpen(false);
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsSearchOpen(false)}
                                            className="absolute right-0 text-neutral-400 hover:text-black"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </motion.form>
                                ) : (
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className="text-neutral-600 hover:text-black transition-colors hidden md:block"
                                    >
                                        <Search className="w-5 h-5 stroke-[1.5]" />
                                    </button>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={toggleCart}
                            className="relative text-neutral-600 hover:text-black transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <button
                            className="md:hidden text-neutral-600"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-6 text-2xl font-medium text-neutral-800">
                            <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>Store</Link>
                            <Link href="/shop?category=PC" onClick={() => setMobileMenuOpen(false)}>Computers</Link>
                            <Link href="/shop?category=Component" onClick={() => setMobileMenuOpen(false)}>Components</Link>
                            <Link href="/shop?category=Laptop" onClick={() => setMobileMenuOpen(false)}>Laptops</Link>
                            <Link href="/shop?category=Accessory" onClick={() => setMobileMenuOpen(false)}>Accessories</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export const Navbar = () => {
    return (
        <Suspense fallback={
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 py-4">
                <div className="container-wide flex items-center justify-between">
                    <Link href="/" className="text-xl font-semibold tracking-tight">
                        Elamriz.
                    </Link>
                </div>
            </nav>
        }>
            <NavbarContent />
        </Suspense>
    );
};
