import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('Missing STRIPE_SECRET_KEY');
        return new NextResponse('Missing Stripe Secret Key', { status: 500 });
    }

    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // We ignore the client-provided priceId because it often causes "No such price" errors
        // due to Test Mode vs Live Mode mismatches. We define the price inline for reliability.
        const { mode = 'payment' } = await req.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'WealthWise Pro',
                            description: 'Unlock full financial insights, unlimited rules, and premium support.',
                        },
                        unit_amount: 1999, // $19.99
                        recurring: mode === 'subscription' ? { interval: 'month' } : undefined,
                    },
                    quantity: 1,
                },
            ],
            mode: mode, // 'payment' or 'subscription'
            success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/pricing?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/pricing?canceled=true`,
            customer_email: user.email,
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
