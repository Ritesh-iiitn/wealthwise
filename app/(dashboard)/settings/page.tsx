"use client";

import { useEffect, useState } from "react";
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, RefreshCw, Shield, Bell, Download, Trash, AlertTriangle, LogOut, LayoutGrid, Lock, CheckCircle2, Moon, Sun } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner" // Assuming sonner or generic toast
import Link from "next/link";
import { PlaidLink } from "@/components/plaid-link";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>({ full_name: '', theme: 'light' });
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('light');
    const [emailNotifications, setEmailNotifications] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUser(user);

            // Fetch Accounts to show in Connections
            const { data: accs } = await supabase
                .from('accounts')
                .select('*')
                .eq('user_id', user.id);
            setAccounts(accs || []);

            // Fetch Profile (Mock if not exists)
            // In real app: supabase.from('profiles').select('*').eq('id', user.id).single()
            setProfile({ full_name: user.user_metadata?.full_name || 'WealthWise User', theme: 'light' });

            setLoading(false);
        };
        fetchData();
    }, []);

    const handleUpdateProfile = async () => {
        // Mock update
        const supabase = createClient();
        await supabase.auth.updateUser({
            data: { full_name: profile.full_name }
        });
        toast.success("Profile updated successfully!");
    };

    const handleDisconnectAccount = async (id: string) => {
        if (!confirm("Are you sure you want to disconnect this account?")) return;
        const supabase = createClient();
        await supabase.from('accounts').delete().eq('id', id);
        setAccounts(accounts.filter(a => a.id !== id));
    };

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h2>
                    <p className="text-slate-500 mt-1">Manage your preferences and account security.</p>
                </div>
                <Button variant="outline" onClick={handleSignOut} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
            </div>

            <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-8 items-start">

                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0">
                    <TabsList className="flex flex-col h-auto items-stretch bg-transparent space-y-1 p-0">
                        <TabsTrigger value="general" className="justify-start px-4 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-slate-100 transition-colors">
                            <User className="mr-3 h-4 w-4" /> General
                        </TabsTrigger>
                        <TabsTrigger value="connections" className="justify-start px-4 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-slate-100 transition-colors">
                            <CreditCard className="mr-3 h-4 w-4" /> Bank Connections
                        </TabsTrigger>
                        <TabsTrigger value="preferences" className="justify-start px-4 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-slate-100 transition-colors">
                            <Bell className="mr-3 h-4 w-4" /> Preferences
                        </TabsTrigger>
                        <TabsTrigger value="security" className="justify-start px-4 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm hover:bg-slate-100 transition-colors">
                            <Shield className="mr-3 h-4 w-4" /> Security
                        </TabsTrigger>
                    </TabsList>
                </aside>

                {/* Content Area */}
                <div className="flex-1 space-y-6 w-full">

                    {/* --- GENERAL TAB --- */}
                    <TabsContent value="general" className="mt-0 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Info</CardTitle>
                                <CardDescription>Update your public profile details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 border-2 border-slate-200">
                                        {profile.full_name?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="space-y-2">
                                        <Button variant="outline" size="sm">Change Avatar</Button>
                                        <p className="text-xs text-slate-500">JPG, GIF or PNG. Max 1MB.</p>
                                    </div>
                                </div>
                                <div className="grid gap-4 max-w-md">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Display Name</Label>
                                        <Input
                                            id="name"
                                            value={profile.full_name}
                                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" value={user?.email} disabled className="bg-slate-50 text-slate-500" />
                                        <p className="text-[10px] text-slate-400">Email cannot be changed securely here.</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50/50 border-t border-slate-100 flex justify-end p-4">
                                <Button onClick={handleUpdateProfile} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* --- CONNECTIONS TAB --- */}
                    <TabsContent value="connections" className="mt-0 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Connected Accounts</CardTitle>
                                    <CardDescription>Manage your linked financial institutions.</CardDescription>
                                </div>
                                <PlaidLink />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {accounts.length === 0 ? (
                                    <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                                        <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                        <p>No accounts connected yet.</p>
                                    </div>
                                ) : (
                                    accounts.map((acc) => (
                                        <div key={acc.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white hover:border-blue-200 transition-colors group">
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                    <CreditCard className="h-6 w-6 text-slate-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{acc.name}</p>
                                                    <p className="text-xs text-slate-500 capitalize">
                                                        {acc.type} • Ends in {acc.mask}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1">
                                                    <CheckCircle2 className="h-3 w-3" /> Synced
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDisconnectAccount(acc.id)}
                                                    className="text-slate-400 hover:text-rose-600"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- PREFERENCES TAB --- */}
                    <TabsContent value="preferences" className="mt-0 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance & Notifications</CardTitle>
                                <CardDescription>Customize how WealthWise looks and communicates.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Email Notifications</Label>
                                        <p className="text-sm text-slate-500">Receive weekly summaries and alerts.</p>
                                    </div>
                                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Dark Mode</Label>
                                        <p className="text-sm text-slate-500">Switch between light and dark themes.</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className={theme === 'light' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}
                                            onClick={() => setTheme('light')}
                                        >
                                            <Sun className="h-4 w-4 mr-2" /> Light
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className={theme === 'dark' ? 'bg-slate-700 shadow-sm text-white' : 'text-slate-500'}
                                            onClick={() => setTheme('dark')}
                                        >
                                            <Moon className="h-4 w-4 mr-2" /> Dark
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- SECURITY TAB --- */}
                    <TabsContent value="security" className="mt-0 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>Manage your password and authentication methods.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Current Password</Label>
                                    <Input type="password" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <Input type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Confirm Password</Label>
                                        <Input type="password" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button variant="outline" disabled>Update Password (Coming Soon)</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-rose-100 bg-rose-50/20">
                            <CardHeader>
                                <CardTitle className="text-rose-700 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" /> Danger Zone
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">Delete Account</p>
                                    <p className="text-sm text-slate-500">Permanently remove all data and connections.</p>
                                </div>
                                <Button variant="destructive">Delete Account</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
