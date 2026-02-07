import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Create a Supabase client with the request's headers
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refreshing the auth token
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const protectedPaths = ['/dashboard', '/accounts', '/analytics', '/budgets', '/get-started', '/settings', '/transactions']

    if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path)) && !user) {
        // If accessing protected routes without user, redirect to login
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') && user) {
        // If accessing auth pages with user, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return supabaseResponse
}
