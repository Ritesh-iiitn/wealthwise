"use client";

import { useEffect, useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Plus, Target, CreditCard, TrendingDown, Shield, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function FinancialRulesPage() {
    const [rules, setRules] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newRule, setNewRule] = useState({ name: '', type: 'savings_target', target_value: '', account_id: '' });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: accs } = await supabase.from('accounts').select('*').eq('user_id', user.id).order('name');
        setAccounts(accs || []);

        const { data: rls } = await supabase
            .from('financial_rules')
            .select('*, accounts(name, balance, type)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        setRules(rls || []);
    };

    const handleCreateRule = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!newRule.name || !newRule.target_value) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const targetVal = parseFloat(newRule.target_value);
        if (isNaN(targetVal)) {
            toast.error("Invalid target amount.");
            return;
        }

        try {
            const { error } = await supabase.from('financial_rules').insert({
                user_id: user.id,
                name: newRule.name,
                type: newRule.type,
                target_value: targetVal,
                account_id: newRule.account_id || null, // Handles empty string
            });

            if (error) {
                console.error("Error creating rule:", error);
                toast.error(`Failed to save rule: ${error.message}`);
            } else {
                toast.success("Rule saved successfully!");
                setIsCreateOpen(false);
                setNewRule({ name: '', type: 'savings_target', target_value: '', account_id: '' });
                fetchRules();
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    const handleDeleteRule = async (id: string) => {
        if (!confirm("Are you sure you want to delete this rule?")) return;

        const supabase = createClient();
        const { error } = await supabase.from('financial_rules').delete().eq('id', id);

        if (error) {
            toast.error(`Failed to delete rule: ${error.message}`);
        } else {
            toast.success("Rule deleted successfully");
            fetchRules();
        }
    };

    const getRuleDetails = (rule: any) => {
        const balance = Number(rule.accounts?.balance || 0);
        const target = Number(rule.target_value);
        let progress = 0;
        let color = "";
        let status = "";
        let icon = Target;

        switch (rule.type) {
            case 'savings_target':
                progress = Math.min((balance / target) * 100, 100);
                color = progress >= 100 ? "bg-emerald-500" : "bg-blue-600";
                status = progress >= 100 ? "Goal Reached! 🎉" : `${progress.toFixed(0)}% Saved`;
                icon = Target;
                break;
            case 'credit_limit':
                progress = Math.min((balance / target) * 100, 100);
                color = progress > 90 ? "bg-rose-500" : (progress > 50 ? "bg-amber-500" : "bg-emerald-500");
                status = `${progress.toFixed(0)}% Utilized`;
                icon = CreditCard;
                break;
            case 'liquidity_floor':
                progress = Math.min((balance / target) * 100, 100);
                color = balance < target ? "bg-rose-500" : "bg-emerald-500";
                status = balance < target ? "Below Safety Net ⚠️" : "Safe & Secure";
                icon = Shield;
                break;
            default:
                progress = 0;
        }
        return { progress, color, status, icon };
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Financial Rules</h2>
                    <p className="text-slate-500 mt-1">Automate your financial health with smart targets.</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20">
                            <Plus className="mr-2 h-4 w-4" /> New Rule
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Set a New Financial Rule</DialogTitle>
                            <DialogDescription>
                                Choose a goal type and link it to an account.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateRule} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Rule Name</Label>
                                <Input id="name" placeholder="e.g. Rainy Day Fund" value={newRule.name} onChange={(e) => setNewRule({ ...newRule, name: e.target.value })} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Rule Goal</Label>
                                <Select onValueChange={(val) => setNewRule({ ...newRule, type: val })} defaultValue="savings_target">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="savings_target">🎯 Savings Target</SelectItem>
                                        <SelectItem value="credit_limit">💳 Credit Limit</SelectItem>
                                        <SelectItem value="liquidity_floor">🛡️ Liquidity Floor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Target Amount ($)</Label>
                                <Input id="amount" type="number" placeholder="5000.00" value={newRule.target_value} onChange={(e) => setNewRule({ ...newRule, target_value: e.target.value })} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="account">Linked Account</Label>
                                <Select onValueChange={(val) => setNewRule({ ...newRule, account_id: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map(acc => (
                                            <SelectItem key={acc.id} value={acc.id}>{acc.name} ({acc.type})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-blue-600 text-white">Save Rule</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {rules.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-slate-50/50">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Target className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No rules defined yet</h3>
                    <p className="text-slate-500 max-w-sm mt-2">
                        Start by setting a savings goal or a spending limit on one of your accounts.
                    </p>
                    <Button variant="outline" className="mt-6" onClick={() => setIsCreateOpen(true)}>Create First Rule</Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {rules.map((rule) => {
                        const { progress, color, status, icon: Icon } = getRuleDetails(rule);
                        return (
                            <Card key={rule.id} className="group overflow-hidden border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
                                <div className={`h-2 w-full ${color}`} />
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                                            {rule.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {rule.accounts?.name}
                                        </CardDescription>
                                    </div>
                                    <div className={`p-2 rounded-lg bg-slate-100 group-hover:bg-white transition-colors`}>
                                        <Icon className="h-4 w-4 text-slate-600" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Current</p>
                                            <p className="text-2xl font-bold text-slate-900">
                                                ${Number(rule.accounts?.balance).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Target</p>
                                            <p className="text-sm font-medium text-slate-700">
                                                ${Number(rule.target_value).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-medium text-slate-600">{status}</span>
                                        </div>
                                        <Progress value={progress} className="h-2 bg-slate-100" indicatorColor={color} />
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2 pb-4 px-6 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-2 text-xs text-slate-400">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                        onClick={() => handleDeleteRule(rule.id)}
                                    >
                                        Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
