import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Lock, CreditCard, PieChart, TrendingUp, DollarSign, Github, Linkedin, LayoutDashboard, Wallet, BarChart3, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-8">
            <div className="w-8 h-8 bg-gradient-to-tr from-green-500 to-emerald-700 rounded-lg flex items-center justify-center">
              <DollarSign className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">WealthWise</span>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-6 text-sm font-medium hidden md:flex">
            <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#features">Features</Link>
            <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#pricing">Pricing</Link>
            <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#about">About</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="ml-auto flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-green-50/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Badge variant="outline" className="px-3 py-1 border-green-200 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-2">
                🚀 New: Smart Financial Rules
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                Data-Driven Financial Control
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl lg:text-2xl mt-4">
                Stop guessing. Connect your banks, set automated rules, and watch your net worth grow with WealthWise.
              </p>
              <div className="space-x-4 mt-8">
                <Link href="/signup">
                  <Button className="h-12 px-8 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20">
                    Join WealthWise <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" className="h-12 px-8 text-lg">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything you need to master your money</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  WealthWise replaces spreadsheets and generic apps with a powerful, automated financial engine.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center p-6 border rounded-xl hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Multi-Bank Sync</h3>
                <p className="text-gray-500">Connect limitless checking, savings, and credit card accounts in one secure dashboard.</p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center p-6 border rounded-xl hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Automated Rules</h3>
                <p className="text-gray-500">Set "Liquidity Floors" and "Debt Limits" linked directly to your real account balances.</p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center p-6 border rounded-xl hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Net Worth Tracking</h3>
                <p className="text-gray-500">Visualize your assets vs. liabilities instantly. Know exactly where you stand every day.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Simple, Transparent Pricing</h2>
              <p className="text-gray-500">Start for free, upgrade for power.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Tier */}
              <div className="flex flex-col p-6 bg-white rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold">Starter</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Connect 1 Bank</li>
                  <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Basic Dashboard</li>
                  <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> 1 Financial Rule</li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full" variant="outline">Sign Up Free</Button>
                </Link>
              </div>

              {/* Pro Tier */}
              <div className="flex flex-col p-6 bg-white rounded-xl shadow-lg border-2 border-green-500 relative">
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-sm">POPULAR</div>
                <h3 className="text-xl font-bold">Pro</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Unlimited Connections</li>
                  <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Advanced Insights</li>
                  <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Unlimited Rules</li>
                  <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Priority Support</li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Get Started</Button>
                </Link>
              </div>

              {/* Enterprise Tier */}
              <div className="flex flex-col p-6 bg-white rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold">Lifetime</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-gray-500"> one-time</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> All Pro Features</li>
                  <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Lifetime Updates</li>
                  <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Early Access</li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full" variant="outline">Buy Lifetime</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-6">Built for Financial Clarity</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
              WealthWise was founded on the belief that everyone deserves a clear picture of their financial health.
              We don't sell your data. We don't push credit cards. We just provide the tools you need to build wealth.
            </p>
            <div className="mt-12 flex justify-center gap-8">
              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 text-gray-400 mb-2" />
                <span className="font-bold">Bank-Grade Security</span>
              </div>
              <div className="flex flex-col items-center">
                <Lock className="h-8 w-8 text-gray-400 mb-2" />
                <span className="font-bold">Private & Encrypted</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 bg-white border-t">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* 1. App Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-green-500 to-emerald-700 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-white h-5 w-5" />
                </div>
                <span className="font-bold text-xl tracking-tight">WealthWise</span>
              </div>
              <p className="text-sm text-gray-500">
                Smart personal finance management.
              </p>
              <div className="flex space-x-4">
                <Link href="https://github.com/Ritesh-iiitn" className="text-gray-400 hover:text-gray-600" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="https://www.linkedin.com/in/ritesh-singh23/" className="text-gray-400 hover:text-gray-600" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* 2. Quick Links */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/dashboard" className="hover:text-green-600">Overview</Link></li>
                <li><Link href="/accounts" className="hover:text-green-600">Accounts</Link></li>
                <li><Link href="/analytics" className="hover:text-green-600">Insights</Link></li>
                <li><Link href="/budgets" className="hover:text-green-600">Financial Rules</Link></li>
                <li><Link href="/settings" className="hover:text-green-600">Settings</Link></li>
              </ul>
            </div>

            {/* 3. Legal / Trust */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-green-600">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-green-600">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-green-600">Data Security</Link></li>
              </ul>
            </div>

            {/* 4. Built By */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm">Attribution</h4>
              <p className="text-sm text-gray-500">
                Built by Ritesh Singh.
              </p>
              <p className="text-xs text-gray-400">
                Powered by Next.js, Supabase, and Plaid.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-xs text-gray-400">
            <p>&copy; 2026 WealthWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
