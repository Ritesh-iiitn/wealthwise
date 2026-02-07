"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, TrendingUp, CheckCircle2, ArrowRight, ShieldCheck, Wallet, PieChart } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- Types ---
type RecType = 'informational' | 'warning' | 'optimization';

interface Recommendation {
    id: string;
    type: RecType;
    message: string;
    reason: string;
    impactArea: string;
    actionLabel: string;
    actionUrl: string;
    scoreImpact?: number; // How much this affects the health score
}

// --- Logic Layer (Recommendation Engine) ---
const generateRecommendations = (accounts: any[]): { recs: Recommendation[], healthScore: number } => {
    const recs: Recommendation[] = [];
    let healthScore = 100; // Start at perfect, deduct/add based on rules

    // 1. Calculate Aggregates
    let totalCash = 0;
    let totalInvestments = 0;
    let totalCreditDebt = 0;
    let numCreditCards = 0;
    let numInvestmentAccounts = 0;
    let creditLimit = 50000; // Mock limit

    accounts.forEach(acc => {
        const bal = Number(acc.balance);
        const type = acc.type.toLowerCase();

        if (['checking', 'savings', 'depository', 'money market'].includes(type)) {
            totalCash += bal;
        }
        if (['investment', 'brokerage', 'ira', '401k', 'crypto'].includes(type)) {
            totalInvestments += bal;
            numInvestmentAccounts++;
        }
        if (['credit', 'credit card'].includes(type)) {
            totalCreditDebt += bal;
            numCreditCards++;
        }
    });

    // 2. Dynamic Rules Engine

    // Rule: Emergency Fund (Critical)
    // Assumption: Monthly expenses ~ $3000 (Mock)
    const monthlyExpenses = 3000;
    const monthsOfRunway = totalCash / monthlyExpenses;

    if (monthsOfRunway < 1) {
        healthScore -= 30;
        recs.push({
            id: 'rec-emergency-critical',
            type: 'warning',
            message: 'Critical: Emergency fund depletion',
            reason: `You have < 1 month of expenses covered ($${totalCash.toLocaleString()}). Prioritize saving immediately.`,
            impactArea: 'Financial Safety',
            actionLabel: 'Set Savings Goal',
            actionUrl: '/budgets',
            scoreImpact: -30
        });
    } else if (monthsOfRunway < 3) {
        healthScore -= 10;
        recs.push({
            id: 'rec-emergency-warning',
            type: 'warning',
            message: 'Build your safety net',
            reason: `You have ${monthsOfRunway.toFixed(1)} months of runway. Aim for 3-6 months ($${(monthlyExpenses * 3).toLocaleString()}+).`,
            impactArea: 'Financial Safety',
            actionLabel: 'Adjust Budgets',
            actionUrl: '/budgets',
            scoreImpact: -10
        });
    }

    // Rule: High Credit Utilization (Warning)
    const utilRatio = creditLimit > 0 ? (totalCreditDebt / creditLimit) : 0;
    if (utilRatio > 0.30) {
        const penalty = utilRatio > 0.5 ? 20 : 10;
        healthScore -= penalty;
        recs.push({
            id: 'rec-credit-util',
            type: 'warning',
            message: `Credit utilization is high (${(utilRatio * 100).toFixed(0)}%)`,
            reason: `High usage hurts your credit score. Consider paying down ${numCreditCards > 1 ? 'highest interest cards first.' : 'your balance.'}`,
            impactArea: 'Credit Score',
            actionLabel: 'Pay Down Debt',
            actionUrl: '/accounts',
            scoreImpact: -penalty
        });
    }

    // Rule: Debt-to-Cash Ratio (Liquidity)
    if (totalCreditDebt > totalCash && totalCash > 0) {
        healthScore -= 15;
        recs.push({
            id: 'rec-liquidity-crunch',
            type: 'warning',
            message: 'Liquidity Crunch Warning',
            reason: `You owe $${totalCreditDebt.toLocaleString()} but only have $${totalCash.toLocaleString()} available. You are technically illiquid.`,
            impactArea: 'Liquidity',
            actionLabel: 'Review Spending',
            actionUrl: '/transactions',
            scoreImpact: -15
        });
    }

    // Rule: Excess Cash / Investment Opportunity
    if (totalCash > 30000 && totalCash > totalInvestments * 2) {
        recs.push({
            id: 'rec-cash-drag',
            type: 'optimization',
            message: `High Cash Drag Detected`,
            reason: `You're holding $${totalCash.toLocaleString()} in low-yield cash. Investing half could generate ~$1,000/yr @ 5%.`,
            impactArea: 'Wealth Growth',
            actionLabel: 'View Investments',
            actionUrl: '/accounts',
            scoreImpact: 0
        });
    }

    // Rule: Investment Diversification
    if (totalInvestments > 0 && numInvestmentAccounts === 1) {
        recs.push({
            id: 'rec-diversify',
            type: 'optimization',
            message: 'Consider Diversifying',
            reason: 'You rely on a single investment account. Spreading assets can reduce risk.',
            impactArea: 'Risk Management',
            actionLabel: 'Explore Accounts',
            actionUrl: '/accounts',
            scoreImpact: 0
        });
    }

    // Rule: Debt Snowball Strategy
    if (numCreditCards > 1 && totalCreditDebt > 1000) {
        recs.push({
            id: 'rec-snowball',
            type: 'optimization',
            message: 'Debt Strategy Available',
            reason: `You have balances on ${numCreditCards} cards. Using the "Snowball Method" (smallest balance first) helps build momentum.`,
            impactArea: 'Debt Management',
            actionLabel: 'View Strategy',
            actionUrl: '/budgets',
            scoreImpact: 0
        });
    }

    return { recs, healthScore: Math.max(0, healthScore) };
};

export default function RecommendationsPage() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [healthScore, setHealthScore] = useState(100);
    const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [isAckOpen, setIsAckOpen] = useState(false);

    useEffect(() => {
        const fetchAndGenerate = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: accounts } = await supabase
                .from('accounts')
                .select('*')
                .eq('user_id', user.id);

            if (accounts) {
                const { recs, healthScore } = generateRecommendations(accounts);
                setRecommendations(recs);
                setHealthScore(healthScore);
            }
            setLoading(false);
        };
        fetchAndGenerate();
    }, []);

    const handleAcknowledge = (id: string) => {
        const newSet = new Set(acknowledgedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setAcknowledgedIds(newSet);
    };

    const activeRecs = recommendations.filter(r => !acknowledgedIds.has(r.id));
    const ackRecs = recommendations.filter(r => acknowledgedIds.has(r.id));

    const getTypeStyles = (type: RecType) => {
        switch (type) {
            case 'warning': return { icon: AlertTriangle, bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700 hover:bg-rose-200' };
            case 'optimization': return { icon: TrendingUp, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' };
            case 'informational': return { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700 hover:bg-blue-200' };
        }
    };

    // Determine Health Color
    const getHealthColor = (score: number) => {
        if (score >= 80) return "text-emerald-500";
        if (score >= 50) return "text-amber-500";
        return "text-rose-500";
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Analysing financial health...</div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">

            {/* 1. Health Score Banner (New Feature) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-lg relative overflow-hidden">
                    <CardContent className="p-8 relative z-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Financial Health Score</h2>
                            <p className="text-slate-400 mt-2 max-w-sm">
                                Based on your liquidity, debt levels, and diversification.
                            </p>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-wider text-slate-400">Score</span>
                                    <span className={`text-5xl font-bold ${getHealthColor(healthScore)}`}>{healthScore}</span>
                                </div>
                                <div className="h-12 w-px bg-slate-700 mx-2" />
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-wider text-slate-400">Status</span>
                                    <span className="text-lg font-medium text-white">
                                        {healthScore >= 80 ? "Excellent" : (healthScore >= 50 ? "Needs Work" : "Critical")}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Interactive Ring Chart (Simulated) */}
                        <div className="hidden md:flex items-center justify-center relative w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="60" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                                <circle
                                    cx="64" cy="64" r="60"
                                    stroke={healthScore >= 80 ? "#10b981" : (healthScore >= 50 ? "#f59e0b" : "#f43f5e")}
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={`${(healthScore / 100) * 377} 377`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <ShieldCheck className="absolute w-8 h-8 text-white/50" />
                        </div>
                    </CardContent>
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                </Card>

                {/* Quick Actions / Stats */}
                <Card className="flex flex-col justify-center p-6 space-y-6">
                    <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Active Suggestions</span>
                        <div className="text-4xl font-bold text-slate-900 mt-1">{activeRecs.length}</div>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Impact</span>
                        <div className="flex items-center gap-2 mt-1">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm font-medium text-slate-700">Improve score by addressing warnings</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full">
                        Recalculate Score
                    </Button>
                </Card>
            </div>

            {/* 2. Recommendations List with Categories */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Your Action Plan</h3>

                </div>

                {activeRecs.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-slate-900">Health Score Optimized!</h4>
                        <p className="text-slate-500">You've addressed all critical items.</p>
                    </div>
                ) : (
                    activeRecs.map((rec) => {
                        const styles = getTypeStyles(rec.type);
                        return (
                            <Card key={rec.id} className={cn("transition-all hover:shadow-lg hover:-translate-y-1 duration-200", styles.border)}>
                                <div className="flex flex-col md:flex-row">
                                    <div className={cn("w-full md:w-3", styles.bg)} />

                                    <div className="flex-1 p-6">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="secondary" className={cn("capitalize rounded-md px-2 py-0.5", styles.badge)}>
                                                        {rec.type}
                                                    </Badge>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                                                        {rec.impactArea}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h4 className="text-xl font-bold text-slate-900 leading-tight">{rec.message}</h4>
                                                    <div className="mt-2 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm leading-relaxed">
                                                        <span className="font-semibold text-slate-700">Why: </span>
                                                        {rec.reason}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-center gap-3 shrink-0 min-w-[140px]">
                                                {rec.actionLabel && (
                                                    <Link href={rec.actionUrl} className="w-full">
                                                        <Button className={cn("w-full shadow-md font-semibold", styles.bg.replace('50', '600'), "hover:opacity-90 text-white border-0 py-5")}>
                                                            {rec.actionLabel} <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600 w-full" onClick={() => handleAcknowledge(rec.id)}>
                                                    Dismiss
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Acknowledged Section */}
            {ackRecs.length > 0 && (
                <Collapsible open={isAckOpen} onOpenChange={setIsAckOpen} className="space-y-4 pt-8 border-t border-slate-100">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="flex items-center w-full justify-between text-slate-500 hover:text-slate-900 group">
                            <span className="font-medium group-hover:underline">Previously Acknowledged ({ackRecs.length})</span>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">{isAckOpen ? "Hide History" : "Show History"}</span>
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4">
                        {ackRecs.map((rec) => (
                            <div key={rec.id} className="opacity-50 hover:opacity-100 transition-opacity">
                                <Card className="border-slate-200 bg-slate-50">
                                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-700 decoration-slate-400 line-through">{rec.message}</p>
                                                <p className="text-xs text-slate-500">Resolved • {rec.impactArea}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={() => handleAcknowledge(rec.id)} className="bg-white">
                                            Move to Active
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
    );
}
