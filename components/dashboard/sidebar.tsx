"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Wallet,
    PieChart,
    BarChart3,
    Settings,
    LogOut,
    DollarSign,
    Sparkles,
    Crown,
} from "lucide-react";

const routes = [
    {
        label: "Overview",
        icon: LayoutDashboard,
        href: "/dashboard",
        activeColor: "text-white",
        iconColor: "text-sky-400",
    },
    {
        label: "Accounts",
        icon: Wallet,
        href: "/accounts",
        activeColor: "text-white",
        iconColor: "text-violet-400",
    },
    {
        label: "Recommendations",
        icon: Sparkles,
        href: "/recommendations",
        activeColor: "text-white",
        iconColor: "text-amber-400",
    },
    {
        label: "Financial Rules",
        icon: PieChart,
        href: "/budgets",
        activeColor: "text-white",
        iconColor: "text-orange-400",
    },
    {
        label: "Insights",
        icon: BarChart3,
        href: "/analytics",
        activeColor: "text-white",
        iconColor: "text-emerald-400",
    },
    {
        label: "Upgrade Plan",
        icon: Crown,
        href: "/pricing",
        activeColor: "text-white",
        iconColor: "text-pink-400",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
        activeColor: "text-white",
        iconColor: "text-slate-400",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white border-r border-slate-800">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14 group">
                    <div className="relative w-8 h-8 mr-4 flex items-center justify-center bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform duration-200">
                        <DollarSign className="text-white h-5 w-5" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors">
                        WealthWise
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition duration-200",
                                pathname === route.href
                                    ? "bg-blue-600 shadow-sm text-white"
                                    : "text-slate-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3 transition-colors", pathname === route.href ? route.activeColor : route.iconColor)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-3 py-2 border-t border-slate-800 pt-4">
                <div
                    onClick={async () => {
                        const { createClient } = await import('@/lib/supabase/client')
                        const supabase = createClient()
                        await supabase.auth.signOut()
                        window.location.href = '/'
                    }}
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-red-400 hover:bg-red-500/10 rounded-lg transition duration-200 text-slate-500"
                >
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 group-hover:text-red-400 transition-colors" />
                        Logout
                    </div>
                </div>
            </div>
        </div>
    );
}
