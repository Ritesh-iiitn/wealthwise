'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2, Sparkles, Shield, Zap, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: 'price_1SyFvAHWLtL6SQI7zcZCd4VE',
                    mode: 'subscription',
                }),
            });

            if (!res.ok) throw new Error('Failed to create checkout session');

            const { url } = await res.json();
            if (url) {
                window.location.href = url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (error: any) {
            console.error('Subscription error:', error);
            toast.error(`Error: ${error.message || 'Something went wrong. Please try again.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto py-8">
            <div className="text-center space-y-4 mb-12">
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    Upgrade to WealthWise <span className="text-blue-600">Pro</span>
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Unlock advanced financial insights, unlimited rules, and premium support.
                    Take full control of your financial future today.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Free Plan */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Basic</CardTitle>
                        <CardDescription>Essential features for personal tracking.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-4xl font-bold text-slate-900">$0 <span className="text-lg font-normal text-slate-500">/mo</span></div>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-emerald-500" /> Connect up to 2 accounts
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-emerald-500" /> Basic transaction categorization
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-emerald-500" /> Monthly spending overview
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-emerald-500" /> 1 Financial Rule
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="outline" disabled>Current Plan</Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="border-blue-200 bg-blue-50/30 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        MOST POPULAR
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            Pro <Sparkles className="h-5 w-5 text-blue-600" />
                        </CardTitle>
                        <CardDescription>Power tools for serious wealth building.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-4xl font-bold text-slate-900">$19.99 <span className="text-lg font-normal text-slate-500">/mo</span></div>
                        <ul className="space-y-3 text-sm text-slate-700 font-medium">
                            <li className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-blue-600" /> Connect unlimited accounts
                            </li>
                            <li className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-blue-600" /> Advanced AI-driven insights
                            </li>
                            <li className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-blue-600" /> Detailed net worth tracking
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-blue-600" /> Unlimited Financial Rules
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-blue-600" /> CSV exports & Custom reports
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                            onClick={handleSubscribe}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Upgrade to Pro'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="mt-16 text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Frequently Asked Questions</h3>
                <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
                    <div>
                        <h4 className="font-medium text-slate-900">Is existing data kept?</h4>
                        <p className="text-sm text-slate-500 mt-1">Yes! Upgrading just unlocks more features. Your data stays safe.</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-slate-900">Can I cancel anytime?</h4>
                        <p className="text-sm text-slate-500 mt-1">Absolutely. Your premium features will remain active until the end of your billing cycle.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
