'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, DollarSign, Mail, Lock, User, Plus } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        const { firstName, lastName, email, password } = formData

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/api/auth/callback`,
                    data: {
                        full_name: `${firstName} ${lastName}`,
                        avatar_url: '',
                    },
                },
            })

            if (error) {
                throw error
            }

            if (data.session) {
                // Ensure default account exists
                const { count } = await supabase.from('accounts').select('*', { count: 'exact', head: true })

                if (count === 0 && data.user) {
                    await supabase.from('accounts').insert({
                        name: 'Cash',
                        type: 'cash',
                        balance: 0,
                        currency: 'USD',
                        user_id: data.user.id
                    })
                }

                // Sign out immediately to force login flow
                await supabase.auth.signOut()

                // Redirect to login page instead of dashboard
                router.push('/login?message=Account created successfully. Please log in.')
            } else {
                setMessage('Account created! Please check your email to confirm.')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Left Column - Branding / Decorative */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-blue-700 p-12 text-white relative overflow-hidden">
                <div className="relative z-10 w-fit">
                    <Link href="/" className="flex items-center gap-2 mb-10">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <DollarSign className="text-white h-6 w-6" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight">WealthWise</span>
                    </Link>
                    <div className="mt-20">
                        <h1 className="text-5xl font-bold leading-tight mb-6">
                            Start your journey<br /> to financial freedom.
                        </h1>
                        <p className="text-xl text-blue-100 max-w-md">
                            Create your account in 30 seconds and join the future of personal finance.
                        </p>
                    </div>
                </div>
                {/* Decorative Circle */}
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="relative z-10 text-sm text-blue-200">
                    &copy; 2026 WealthWise Inc.
                </div>
            </div>

            {/* Right Column - Signup Form */}
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
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create an account</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Enter your details below to get started.
                        </p>
                    </div>

                    <Card className="border-0 shadow-none lg:border lg:shadow-sm bg-transparent lg:bg-white">
                        <CardContent className="pt-6 px-0 lg:px-6">
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className="text-sm font-medium text-slate-700">First Name</label>
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            className="h-11 bg-white"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last Name</label>
                                        <Input
                                            id="lastName"
                                            placeholder="Doe"
                                            className="h-11 bg-white"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

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
                                    <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            className="pl-10 h-11 bg-white"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 ml-1">Must be at least 8 characters long.</p>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100 flex items-center">
                                        <span className="mr-2">❌</span> {error}
                                    </div>
                                )}
                                {message && (
                                    <div className="p-3 rounded-md bg-green-50 text-green-600 text-sm border border-green-100 flex items-center">
                                        <span className="mr-2">✅</span> {message}
                                    </div>
                                )}

                                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-medium text-base shadow-sm shadow-blue-600/20" type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Account
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 px-0 lg:px-6 pb-6">
                            <div className="relative w-full">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-slate-50 lg:bg-white px-2 text-slate-400">Or log in with</span>
                                </div>
                            </div>
                            <div className="text-center text-sm text-slate-500 mt-2">
                                Already have an account?{' '}
                                <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-500 hover:underline">
                                    Sign in here
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
