import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
]);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return new NextResponse('Missing Stripe Webhook Secret', { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Initialize Admin Supabase Client (Service Role)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;

                // Only handle subscriptions
                if (session.mode === 'subscription' && session.subscription) {
                    const subscriptionId = session.subscription as string;
                    const customerId = session.customer as string;
                    const userId = session.metadata?.userId;

                    if (!userId) {
                        console.error('Missing userId in session metadata');
                        break;
                    }

                    // Retrieve full subscription details
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                    await supabaseAdmin.from('subscriptions').upsert({
                        user_id: userId,
                        stripe_subscription_id: subscriptionId,
                        stripe_customer_id: customerId,
                        stripe_price_id: subscription.items.data[0].price.id,
                        status: subscription.status,
                        stripe_current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                    });
                }
                break;
            }

            case 'invoice.payment_succeeded': {
                // Refresh period end date on successful recurring payment
                const invoice = event.data.object as any;
                const subscriptionId = invoice.subscription;

                if (subscriptionId) {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    await supabaseAdmin
                        .from('subscriptions')
                        .update({
                            stripe_current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                            status: subscription.status,
                        })
                        .eq('stripe_subscription_id', subscriptionId);
                }
                break;
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;

                // Update status in DB
                await supabaseAdmin
                    .from('subscriptions')
                    .update({
                        status: subscription.status,
                        stripe_price_id: subscription.items.data[0].price.id,
                        stripe_current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id);
                break;
            }
        }
    } catch (error: any) {
        console.error('Error processing webhook:', error);
        return new NextResponse(`Webhook Handler Error: ${error.message}`, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
