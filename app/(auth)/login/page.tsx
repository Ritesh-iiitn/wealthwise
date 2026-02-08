'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, DollarSign, Mail, Lock } from 'lucide-react'

import { Suspense, useState } from 'react'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(searchParams.get('message'))

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { email, password } = formData

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                throw error
            }

            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Left Column - Branding / Decorative */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-900 p-12 text-white">
                <div>
                    <Link href="/" className="flex items-center gap-2 mb-10 w-fit">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <DollarSign className="text-white h-6 w-6" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight">WealthWise</span>
                    </Link>
                    <div className="mt-20">
                        <h1 className="text-5xl font-bold leading-tight mb-6">
                            Master your money,<br /> build your future.
                        </h1>
                        <p className="text-xl text-slate-400 max-w-md">
                            Join thousands of users who have taken control of their financial life with WealthWise's automated insights.
                        </p>
                    </div>
                </div>
                <div className="text-sm text-slate-500">
                    &copy; 2026 WealthWise Inc.
                </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 relative">
                <Link
                    href="/"
                    className="absolute top-8 right-8 flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                <DollarSign className="text-white h-7 w-7" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Enter your credentials to access your dashboard.
                        </p>
                    </div>

                    <Card className="border-0 shadow-none lg:border lg:shadow-sm bg-transparent lg:bg-white">
                        <CardContent className="pt-6 px-0 lg:px-6">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-10 h-11 bg-white"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                                        <Link href="#" className="text-sm text-blue-600 hover:text-blue-500">First time?</Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 h-11 bg-white"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm flex items-center">
                                        <span className="mr-2">⚠️</span> {error}
                                    </div>
                                )}
                                {message && (
                                    <div className="p-3 rounded-md bg-green-50 text-green-600 text-sm flex items-center">
                                        <span className="mr-2">✅</span> {message}
                                    </div>
                                )}

                                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-medium text-base shadow-sm shadow-blue-600/20" type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Sign In
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 px-0 lg:px-6 pb-6">
                            <div className="relative w-full">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-slate-50 lg:bg-white px-2 text-slate-400">Or continue with</span>
                                </div>
                            </div>
                            <div className="text-center text-sm text-slate-500 mt-2">
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-500 hover:underline">
                                    Create one now
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
