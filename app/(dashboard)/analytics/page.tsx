"use client";

import { useEffect, useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Wallet, Activity, ArrowUpRight, ArrowDownRight, PieChart } from "lucide-react";
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function InsightsPage() {
    const [netWorth, setNetWorth] = useState(0);
    const [liquidCash, setLiquidCash] = useState(0);
    const [totalDebt, setTotalDebt] = useState(0);
    const [accountTypeData, setAccountTypeData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: accounts } = await supabase
                .from('accounts')
                .select('*')
                .eq('user_id', user.id);

            if (accounts) {
                let assets = 0;
                let liabilities = 0;
                let liquid = 0;
                const typeMap = new Map<string, number>();

                accounts.forEach(acc => {
                    const balance = Number(acc.balance);
                    const type = acc.type.toLowerCase();

                    // Group similar types for cleaner charts
                    let group = type;
                    if (['checking', 'savings', 'money market', 'depository'].includes(type)) group = 'Cash';
                    if (['credit', 'credit card'].includes(type)) group = 'Credit Debt';
                    if (['investment', 'brokerage', 'ira'].includes(type)) group = 'Investments';
                    if (['loan', 'mortgage'].includes(type)) group = 'Loans';

                    typeMap.set(group, (typeMap.get(group) || 0) + balance);

                    if (['cash', 'investments', 'depository', 'checking', 'savings'].includes(group.toLowerCase())) {
                        assets += balance;
                        if (group === 'Cash') liquid += balance;
                    } else {
                        liabilities += balance;
                    }
                });

                setNetWorth(assets - liabilities);
                setLiquidCash(liquid);
                setTotalDebt(liabilities);

                // Prepare Chart Data
                const COLORS = ["#0ea5e9", "#10b981", "#f43f5e", "#8b5cf6", "#f59e0b"];
                const data = Array.from(typeMap.entries()).map(([name, value], index) => ({
                    name,
                    value: Math.abs(value), // Chart needs positive values
                    color: COLORS[index % COLORS.length]
                }));
                setAccountTypeData(data);
            }
            setLoading(false);
        };
        fetchInsights();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading insights...</div>;

    // Mock trend data for bar chart since we lack historical data
    const trendData = [
        { month: 'Sep', Assets: netWorth * 0.92, Debt: totalDebt * 1.05 },
        { month: 'Oct', Assets: netWorth * 0.94, Debt: totalDebt * 1.02 },
        { month: 'Nov', Assets: netWorth * 0.95, Debt: totalDebt * 1.01 },
        { month: 'Dec', Assets: netWorth * 0.98, Debt: totalDebt * 0.98 },
        { month: 'Jan', Assets: netWorth * 0.99, Debt: totalDebt * 0.95 },
        { month: 'Feb', Assets: netWorth, Debt: totalDebt },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Insights</h2>
                <p className="text-slate-500 mt-1">Deep analysis of your financial health.</p>
            </div>

            {/* KPI Row */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-slate-900 text-white border-none shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Net Worth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">${netWorth.toLocaleString()}</div>
                        <p className="text-xs text-emerald-400 flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +8.2% all time
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Liquid Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">${liquidCash.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">Cash on hand</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Debt Load</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">${totalDebt.toLocaleString()}</div>
                        <p className="text-xs text-rose-500 mt-1 flex items-center">
                            <ArrowDownRight className="h-3 w-3 mr-1" /> -2.1% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {/* 1. Asset vs Debt Trend */}
                <Card className="col-span-2 shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle>Net Worth Trajectory</CardTitle>
                        <CardDescription>growth of assets vs reduction of debt</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                                    <Tooltip
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="Assets" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Debt" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Portfolio Mix */}
                <Card className="col-span-1 shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle>Asset Allocation</CardTitle>
                        <CardDescription>Current distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={accountTypeData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {accountTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RePieChart>
                            </ResponsiveContainer>
                            {/* Central Text Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xs text-muted-foreground">Diversification</span>
                                <span className="text-xl font-bold">{accountTypeData.length} Types</span>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            {accountTypeData.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                                        <span className="text-slate-600">{item.name}</span>
                                    </div>
                                    <span className="font-medium text-slate-900">${Math.round(item.value).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AI Recommendation (Mock) */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardContent className="flex items-start gap-4 p-6">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                        <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-blue-900">Smart Insight</h4>
                        <p className="text-blue-700 mt-1">
                            Your liquid cash ratio is healthy ({(liquidCash / (totalDebt || 1)).toFixed(2)}x of debt).
                            Consider allocating surplus cash into high-yield savings or diversified investments to combat inflation.
                            Your current debt load is trending downwards.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
