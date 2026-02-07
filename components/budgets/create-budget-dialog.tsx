"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Check if Label exists, if not use native label or create one. Assuming standard shadcn.
import { createClient } from "@/lib/supabase/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

// Simple Label component if needed, usually in components/ui/label.tsx
// Let's assume it exists or use standard label for now to be safe.

interface CreateBudgetDialogProps {
    categories: { id: string, name: string }[];
    onBudgetCreated: () => void;
}

export function CreateBudgetDialog({ categories, onBudgetCreated }: CreateBudgetDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [period, setPeriod] = useState("monthly");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { error } = await supabase.from('budgets').insert({
                user_id: user.id,
                name,
                amount: parseFloat(amount),
                category_id: categoryId || null,
                period
            });

            if (!error) {
                setOpen(false);
                setName("");
                setAmount("");
                setCategoryId("");
                onBudgetCreated();
                router.refresh();
            } else {
                console.error(error);
            }
        }
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Budget
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                    <DialogDescription>
                        Set a spending limit for a specific category or overall.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">Budget Name</label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Groceries, Entertainment"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="amount" className="text-sm font-medium">Monthly Limit ($)</label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="category" className="text-sm font-medium">Category (Optional)</label>
                        <select
                            id="category"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Overall Budget</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Budget"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
