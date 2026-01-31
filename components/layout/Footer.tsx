import Link from "next/link";
import { Twitter, Instagram, Github } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-[#f5f5f7] pt-20 pb-10 border-t border-[#d2d2d7]">
            <div className="container-wide">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">

                    <div className="col-span-2">
                        <Link href="/" className="text-lg font-semibold tracking-tight text-[#1d1d1f] mb-4 block">
                            Elamriz.
                        </Link>
                        <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
                            Premium refurbished hardware for the modern enthusiast.
                            Sustainability meets performance.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Shop</h4>
                        <Link href="/shop" className="text-sm text-neutral-500 hover:text-[#0071e3] transition-colors">All Products</Link>
                        <Link href="/shop/gpus" className="text-sm text-neutral-500 hover:text-[#0071e3] transition-colors">Graphics Cards</Link>
                        <Link href="/shop/cpus" className="text-sm text-neutral-500 hover:text-[#0071e3] transition-colors">Processors</Link>
                        <Link href="/shop/laptops" className="text-sm text-neutral-500 hover:text-[#0071e3] transition-colors">Laptops</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Support</h4>
                        <Link href="/track" className="text-sm text-neutral-500 hover:text-[#0071e3] transition-colors">Order Status</Link>
                        <Link href="/warranty" className="text-sm text-neutral-500 hover:text-[#0071e3] transition-colors">Warranty</Link>
                        <Link href="/returns" className="text-sm text-neutral-500 hover:text-[#0071e3] transition-colors">Returns</Link>
                        <Link href="/contact" className="text-sm text-neutral-500 hover:text-[#0071e3] transition-colors">Contact Us</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">Legal</h4>
                        <Link href="/privacy" className="text-sm text-neutral-500 hover:text-[#0071e3] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm text-neutral-500 hover:text-[#0071e3] transition-colors">Terms of Service</Link>
                    </div>
                </div>

                <div className="pt-8 border-t border-[#d2d2d7]/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-neutral-400">
                        © {new Date().getFullYear()} Elamriz Inc. All rights reserved.
                    </p>

                    <div className="flex gap-6">
                        <a href="#" className="text-neutral-400 hover:text-[#1d1d1f] transition-colors"><Twitter className="w-4 h-4" /></a>
                        <a href="#" className="text-neutral-400 hover:text-[#1d1d1f] transition-colors"><Instagram className="w-4 h-4" /></a>
                        <a href="#" className="text-neutral-400 hover:text-[#1d1d1f] transition-colors"><Github className="w-4 h-4" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
