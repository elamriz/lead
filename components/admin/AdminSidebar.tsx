"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut } from "lucide-react";

export function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/products", label: "Products", icon: Package },
        { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[#d2d2d7]/30 bg-white/80 backdrop-blur-xl transition-transform">
            <div className="flex h-full flex-col justify-between px-3 py-4">
                <div>
                    <div className="mb-8 px-4 mt-4">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tighter">Shop<span className="text-[#0071e3]">.Admin</span></span>
                        </Link>
                    </div>
                    <ul className="space-y-1 font-medium">
                        {links.map((link) => {
                            const Icon = link.icon;
                            let isActive = pathname === link.href;
                            // Approximate matching for sub-routes
                            if (link.href !== "/admin" && pathname?.startsWith(link.href)) {
                                isActive = true;
                            }

                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`flex items-center rounded-xl px-4 py-3 text-sm transition-all duration-200 group ${isActive
                                                ? "bg-[#1d1d1f] text-white shadow-md shadow-black/5"
                                                : "text-neutral-500 hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
                                            }`}
                                    >
                                        <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-neutral-400 group-hover:text-[#1d1d1f]"}`} />
                                        {link.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="p-4 border-t border-[#d2d2d7]/30">
                    <button className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                        <LogOut className="mr-3 h-5 w-5" />
                        Log Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
