
import { createClient } from '@/lib/supabase/client';

export interface SubscriptionStatus {
    isPremium: boolean;
    plan: 'free' | 'premium';
    status: string | null;
    currentPeriodEnd: Date | null;
}

export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { isPremium: false, plan: 'free', status: null, currentPeriodEnd: null };
    }

    const { data: subscription } = await supabase
        .from('subscriptions' as any)
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .maybeSingle();

    if (subscription) {
        return {
            isPremium: true,
            plan: 'premium',
            status: (subscription as any).status,
            currentPeriodEnd: new Date((subscription as any).stripe_current_period_end),
        };
    }

    return { isPremium: false, plan: 'free', status: null, currentPeriodEnd: null };
};
