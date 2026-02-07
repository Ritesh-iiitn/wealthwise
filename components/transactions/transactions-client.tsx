"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
    ArrowUpDown,
    ArrowDownCircle,
    Clock,
    Tag,
    Wallet,
    Calendar,
    Hash
} from "lucide-react";
import { format } from "date-fns";

interface Transaction {
    id: string;
    amount: number;
    description: string;
    date: string;
    type: 'income' | 'expense';
    pending?: boolean;
    payee?: string;
    plaid_transaction_id?: string;
    account?: {
        name: string;
        type: string;
    };
    category?: {
        name: string;
        color?: string;
    };
}

interface TransactionsClientProps {
    initialTransactions: Transaction[];
    accounts: { id: string, name: string }[];
    categories: { id: string, name: string }[];
}

export function TransactionsClient({ initialTransactions, accounts, categories }: TransactionsClientProps) {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAccount, setFilterAccount] = useState("all");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterType, setFilterType] = useState("all");

    // Details Drawer State
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    // Filtering Logic
    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch =
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.payee?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesAccount = filterAccount === "all" || transaction.account?.name === filterAccount;

        const matchesCategory = filterCategory === "all" || transaction.category?.name === filterCategory;
        const matchesType = filterType === "all" || (filterType === 'income' ? transaction.type === 'income' : transaction.type === 'expense');

        return matchesSearch && matchesAccount && matchesCategory && matchesType;
    });

    // Sorting Logic
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;
        let valueA: any = a[key as keyof Transaction];
        let valueB: any = b[key as keyof Transaction];

        // Handle nested properties
        if (key === 'account') {
            valueA = a.account?.name || '';
            valueB = b.account?.name || '';
        }
        if (key === 'category') {
            valueA = a.category?.name || '';
            valueB = b.category?.name || '';
        }

        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <Input
                        placeholder="Search transactions..."
                        className="w-[250px] lg:w-[350px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* Filters */}
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={filterAccount}
                        onChange={(e) => setFilterAccount(e.target.value)}
                    >
                        <option value="all">All Accounts</option>
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.name}>{acc.name}</option>
                        ))}
                    </select>

                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">
                                <Button variant="ghost" className="p-0 hover:bg-transparent font-semibold" onClick={() => requestSort('date')}>
                                    Date
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="min-w-[200px]">Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" className="p-0 hover:bg-transparent font-semibold" onClick={() => requestSort('amount')}>
                                    Amount
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="font-medium">
                                        {format(new Date(transaction.date), "MMM dd, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{transaction.payee || transaction.description}</span>
                                            {transaction.pending && (
                                                <Badge variant="outline" className="w-fit mt-1 text-[10px] px-1 py-0 h-4 border-yellow-500 text-yellow-600">Pending</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground">
                                            {transaction.category?.name || 'Uncategorized'}
                                        </div>
                                    </TableCell>
                                    <TableCell>{transaction.account?.name}</TableCell>
                                    <TableCell className="text-right">
                                        <div className={`flex items-center justify-end font-medium ${transaction.type === 'income' ? 'text-green-600' : ''}`}>
                                            {transaction.type === 'income' ? <ArrowDownCircle className="mr-2 h-4 w-4" /> : null}
                                            {transaction.type === 'expense' && transaction.amount > 0 ? '-' : ''}
                                            ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedTransaction(transaction)}
                                        >
                                            Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {filteredTransactions.length} transaction(s) found.
                </div>
            </div>

            {/* Transaction Details Dialog */}
            <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about this transaction.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedTransaction && (
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg">
                                <div className={`text-3xl font-bold ${selectedTransaction.type === 'income' ? 'text-green-600' : ''}`}>
                                    {selectedTransaction.type === 'expense' && selectedTransaction.amount > 0 ? '-' : '+'}
                                    ${Math.abs(selectedTransaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1 capitalize">
                                    {selectedTransaction.payee || selectedTransaction.description}
                                </div>
                                {selectedTransaction.pending && (
                                    <Badge variant="outline" className="mt-2 border-yellow-500 text-yellow-600">Pending Authorization</Badge>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="mr-2 h-4 w-4" /> Date
                                    </div>
                                    <div className="text-sm font-medium">
                                        {format(new Date(selectedTransaction.date), "MMMM dd, yyyy")}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between border-b pb-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Tag className="mr-2 h-4 w-4" /> Category
                                    </div>
                                    <div className="text-sm font-medium">
                                        {selectedTransaction.category?.name || 'Uncategorized'}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between border-b pb-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Wallet className="mr-2 h-4 w-4" /> Account
                                    </div>
                                    <div className="text-sm font-medium">
                                        {selectedTransaction.account?.name}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between border-b pb-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="mr-2 h-4 w-4" /> Status
                                    </div>
                                    <div className="text-sm font-medium capitalize">
                                        {selectedTransaction.pending ? 'Pending' : 'Posted'}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Hash className="mr-2 h-4 w-4" /> Plaid ID
                                    </div>
                                    <div className="text-xs font-mono text-muted-foreground truncate max-w-[200px]" title={selectedTransaction.plaid_transaction_id}>
                                        {selectedTransaction.plaid_transaction_id || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
