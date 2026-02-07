"use client";

import { useEffect, useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight, Activity, DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OverviewPage() {
    const [stats, setStats] = useState({
        netWorth: 0,
        liquidCash: 0,
        totalDebt: 0,
        monthlyChange: 0
    });
    const [accounts, setAccounts] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch Accounts
            const { data: accs } = await supabase
                .from('accounts')
                .select('*')
                .eq('user_id', user.id)
                .order('balance', { ascending: false });

            if (accs) {
                setAccounts(accs);
                let assets = 0;
                let liabilities = 0;
                let liquid = 0;

                accs.forEach(acc => {
                    const balance = Number(acc.balance);
                    const type = acc.type.toLowerCase();

                    if (['depository', 'checking', 'savings', 'money market', 'investment', 'brokerage'].includes(type)) {
                        assets += balance;
                        if (['depository', 'checking', 'savings'].includes(type)) liquid += balance;
                    } else if (['credit', 'loan', 'mortgage', 'credit card'].includes(type)) {
                        liabilities += balance;
                    } else {
                        assets += balance;
                    }
                });

                setStats({
                    netWorth: assets - liabilities,
                    liquidCash: liquid,
                    totalDebt: liabilities,
                    monthlyChange: 2.4 // Mock percentage
                });
            }

            // Fetch Recent Transactions (Mock or Real)
            // For now, let's mock some chart data based on balance history if available, or static
            setLoading(false);
        };

        fetchData();
    }, []);

    // Mock Data for Chart
    const data = [
        { name: 'Jan', amount: 4000 },
        { name: 'Feb', amount: 3000 },
        { name: 'Mar', amount: 2000 },
        { name: 'Apr', amount: 2780 },
        { name: 'May', amount: 1890 },
        { name: 'Jun', amount: 2390 },
        { name: 'Jul', amount: 3490 },
    ];

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading your financial overview...</div>
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-slate-500 mt-1">Here's what's happening with your money today.</p>
                </div>
                <div className="hidden md:flex items-center space-x-2 bg-white p-1 rounded-lg border border-slate-200">
                    <button className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-900 rounded-md shadow-sm">Overview</button>
                    <button className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">Analytics</button>
                    <button className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">Reports</button>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Net Worth Card */}
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Net Worth</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            ${stats.netWorth.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-xs text-emerald-600 flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +2.4% from last month
                        </p>
                    </CardContent>
                </Card>

                {/* Liquid Cash Card */}
                <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Liquid Cash</CardTitle>
                        <Wallet className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            ${stats.liquidCash.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Available in checking & savings
                        </p>
                    </CardContent>
                </Card>

                {/* Total Debt Card */}
                <Card className="border-l-4 border-l-rose-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Debt</CardTitle>
                        <CreditCard className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            ${stats.totalDebt.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-xs text-rose-600 flex items-center mt-1">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            -1.2% reduction
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid gap-6 md:grid-cols-7">

                {/* Chart Section (Left 4 cols) */}
                <Card className="md:col-span-4 shadow-sm border-0">
                    <CardHeader>
                        <CardTitle>Cash Flow Trend</CardTitle>
                        <CardDescription>Income vs Expenses over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                        itemStyle={{ color: '#1e293b' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorAmount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Accounts List (Right 3 cols) */}
                <Card className="md:col-span-3 shadow-sm border-0">
                    <CardHeader>
                        <CardTitle>Your Accounts</CardTitle>
                        <CardDescription>
                            {accounts.length} connected institutions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {accounts.slice(0, 5).map((account) => (
                                <div key={account.id} className="flex items-center">
                                    <div className={`
                                        h-10 w-10 rounded-full flex items-center justify-center mr-4 shrink-0
                                        ${['checking', 'savings'].includes(account.type) ? 'bg-blue-100 text-blue-600' : ''}
                                        ${['credit', 'credit card'].includes(account.type) ? 'bg-rose-100 text-rose-600' : ''}
                                        ${['investment'].includes(account.type) ? 'bg-emerald-100 text-emerald-600' : ''}
                                        ${!['checking', 'savings', 'credit', 'credit card', 'investment'].includes(account.type) ? 'bg-slate-100 text-slate-600' : ''}
                                    `}>
                                        {['checking', 'savings'].includes(account.type) && <Wallet className="h-5 w-5" />}
                                        {['credit', 'credit card'].includes(account.type) && <CreditCard className="h-5 w-5" />}
                                        {['investment'].includes(account.type) && <TrendingUp className="h-5 w-5" />}
                                        {!['checking', 'savings', 'credit', 'credit card', 'investment'].includes(account.type) && <DollarSign className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none text-slate-900">{account.name}</p>
                                        <p className="text-xs text-slate-500 capitalize">{account.type} • {account.mask || '****'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-900">
                                            ${Number(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {accounts.length === 0 && (
                                <div className="text-center py-6 text-slate-500 text-sm">
                                    No accounts connected yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
