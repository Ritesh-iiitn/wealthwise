import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { plaidClient } from '@/lib/plaid';
import { CountryCode, Products } from 'plaid';

export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const request = {
            user: {
                client_user_id: user.id,
            },
            client_name: 'WealthWise',
            products: [Products.Transactions],
            country_codes: [CountryCode.Us],
            language: 'en',
        };

        const createTokenResponse = await plaidClient.linkTokenCreate(request);

        return NextResponse.json({ link_token: createTokenResponse.data.link_token });
    } catch (error: any) {
        console.error('Error creating link token:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
