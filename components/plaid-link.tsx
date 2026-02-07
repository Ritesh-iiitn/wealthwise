'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink, PlaidLinkOnSuccess, PlaidLinkOptions } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const PlaidLink = () => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const createLinkToken = async () => {
            try {
                const response = await fetch('/api/plaid/create-link-token', {
                    method: 'POST',
                });
                const data = await response.json();
                setToken(data.link_token);
            } catch (err) {
                console.error('Error creating link token', err);
            }
        };
        createLinkToken();
    }, []);

    const onSuccess = useCallback<PlaidLinkOnSuccess>(
        async (public_token, metadata) => {
            setLoading(true);
            try {
                await fetch('/api/plaid/exchange-public-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        public_token,
                        institution_id: metadata.institution?.institution_id,
                        institution_name: metadata.institution?.name,
                    }),
                });
                router.refresh();
            } catch (err) {
                console.error('Error exchanging public token', err);
            } finally {
                setLoading(false);
            }
        },
        [router]
    );

    const config: PlaidLinkOptions = {
        token,
        onSuccess,
    };

    const { open, ready } = usePlaidLink(config);

    return (
        <Button
            onClick={() => open()}
            disabled={!ready || loading}
            className="bg-black hover:bg-zinc-800 text-white"
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting Bank...
                </>
            ) : (
                'Connect Bank'
            )}
        </Button>
    );
};
