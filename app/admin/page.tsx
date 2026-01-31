"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            // Fetch product count
            const { count: productCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            // Mock other stats for now as we don't have orders table yet
            setStats({
                totalProducts: productCount || 0,
                totalOrders: 12, // Mock
                revenue: 12450 // Mock
            });
            setLoading(false);
        }

        fetchStats();
    }, []);

    const statCards = [
        { label: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, trend: "+12.5%" },
        { label: "Orders", value: stats.totalOrders.toString(), icon: ShoppingBag, trend: "+4.2%" },
        { label: "Products", value: stats.totalProducts.toString(), icon: Package, trend: "+2" },
        { label: "Growth", value: "24%", icon: TrendingUp, trend: "+1.2%" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#1d1d1f]">Dashboard</h1>
                <p className="text-neutral-500 mt-1">Overview of your store's performance.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="rounded-3xl bg-white p-6 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] border border-neutral-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-neutral-50 rounded-xl">
                                    <Icon className="w-6 h-6 text-[#1d1d1f]" />
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-[#1d1d1f]">{loading ? "..." : stat.value}</h3>
                            <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="rounded-3xl bg-white p-8 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] border border-neutral-100">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="h-64 flex items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-100 rounded-xl">
                    Chart / Activity Feed Placeholder
                </div>
            </div>
        </div>
    );
}
