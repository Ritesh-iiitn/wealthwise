import { createClient } from "@/lib/supabase/server";
import { PlaidLink } from "@/components/plaid-link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, AlertCircle, CheckCircle2, Building2, Trash2, RefreshCw, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Helper for type badges
function getTypeBadge(type: string) {
    const t = type.toLowerCase();
    if (['checking', 'savings', 'depository', 'money market'].includes(t)) {
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Checking / Savings</Badge>;
    }
    if (['credit', 'credit card', 'loan', 'mortgage'].includes(t)) {
        return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">Credit / Loan</Badge>;
    }
    if (['investment', 'brokerage', 'ira', '401k'].includes(t)) {
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Investment</Badge>;
    }
    return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Other</Badge>;
}

export default async function AccountsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Please log in to view accounts.</div>
    }

    // 1. Fetch Accounts
    const { data: accounts } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

    // 2. Fetch Linked Items (Institutions) if table exists, or Mock grouping
    // Since we store institution_id in accounts, we can group by it.
    // For a real app, you might join with a 'plaid_items' table to get the Institution Name properly.
    // Assuming 'institution_id' is user-facing or we have a map.
    // Let's group by `institution_id` for now.

    // Mocking Institution Names for demo if just IDs are available
    const getInstitutionName = (id: string | null) => {
        if (!id) return "Manual Account";
        if (id.includes('chase')) return "Chase Bank";
        if (id.includes('amex')) return "American Express";
        if (id.includes('citi')) return "Citi";
        if (id.includes('wf')) return "Wells Fargo";
        return "Bank Connection";
    };

    // Group accounts by Institution
    const groupedAccounts: Record<string, typeof accounts> = {};
    accounts?.forEach(acc => {
        // Use a dummy group if ID is missing
        const key = acc.institution_id || 'manual';
        if (!groupedAccounts[key]) {
            groupedAccounts[key] = [];
        }
        groupedAccounts[key]?.push(acc);
    });

    return (
        <div className="space-y-8">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Accounts</h2>
                    <p className="text-slate-500 mt-1">Manage your connected financial institutions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <PlaidLink />
                </div>
            </div>

            {/* Main Content - Institution Groups */}
            <div className="space-y-6">
                {Object.keys(groupedAccounts).length === 0 ? (
                    <div className="mt-6 p-12 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                        <Building2 className="h-12 w-12 mb-4 opacity-30" />
                        <p className="text-lg font-medium text-slate-600">No banks connected</p>
                        <p className="text-sm mt-1">Link an account to start tracking your wealth.</p>
                    </div>
                ) : (
                    Object.entries(groupedAccounts).map(([instId, accountList]) => {
                        const institutionName = getInstitutionName(instId); // Replace with real lookup

                        return (
                            <Card key={instId} className="overflow-hidden border-slate-200 shadow-sm">
                                {/* Institution Header */}
                                <div className="bg-slate-50/80 border-b border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                                            <Building2 className="h-5 w-5 text-slate-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{institutionName}</h3>
                                            <div className="flex items-center text-xs text-slate-500 mt-0.5">
                                                <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" />
                                                <span>Synced: Just now</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 -mr-2">
                                        Disconnect Bank
                                    </Button>
                                </div>

                                {/* Accounts List */}
                                <div className="divide-y divide-slate-100">
                                    {accountList?.map((acc) => (
                                        <div key={acc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/50 transition-colors gap-4">
                                            <div className="flex items-center gap-4">
                                                {/* Icon based on subtype */}
                                                <div className="hidden sm:flex h-10 w-10 rounded-full bg-slate-100 items-center justify-center text-slate-500">
                                                    {['credit', 'credit card'].includes(acc.type.toLowerCase()) ? <CreditCard className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-slate-900">{acc.name}</span>
                                                        {getTypeBadge(acc.type)}
                                                    </div>
                                                    <p className="text-sm text-slate-500 font-mono">
                                                        •••• {acc.mask || 'N/A'} • {acc.currency || 'USD'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                                <div className="text-right">
                                                    <span className="block text-lg font-bold text-slate-900">
                                                        ${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </span>
                                                    <span className="text-xs text-slate-400">Current Balance</span>
                                                </div>
                                                {/* Mobile chevron or action could go here */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
