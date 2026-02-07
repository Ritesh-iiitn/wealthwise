import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { plaidClient } from '@/lib/plaid';
import { CountryCode, Products } from 'plaid';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { public_token, institution_id, institution_name } = body;

        // 1. Exchange public_token for access_token
        const exchangeResponse = await plaidClient.itemPublicTokenExchange({
            public_token,
        });

        const accessToken = exchangeResponse.data.access_token;
        const itemId = exchangeResponse.data.item_id;

        // 2. Store access_token in plaid_items table
        // We use upsert to handle re-linking if necessary
        const { data: plaidItem, error: plaidItemError } = await supabase
            .from('plaid_items')
            .upsert({
                user_id: user.id,
                access_token: accessToken,
                item_id: itemId,
                institution_id,
                institution_name
            }, { onConflict: 'user_id, institution_id' })
            .select()
            .single();

        if (plaidItemError) {
            console.error('Error storing plaid item:', plaidItemError);
            throw new Error('Failed to store bank connection.');
        }

        const plaidItemId = plaidItem.id;

        // 3. Fetch Accounts
        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accounts = accountsResponse.data.accounts;

        // 4. Store/Update Accounts
        for (const account of accounts) {
            // Check if account exists by plaid_account_id
            const { data: existingAccount } = await supabase
                .from('accounts')
                .select('id')
                .eq('plaid_account_id', account.account_id)
                .maybeSingle();

            if (existingAccount) {
                await supabase.from('accounts').update({
                    balance: account.balances.current || 0,
                    updated_at: new Date().toISOString()
                }).eq('id', existingAccount.id);
            } else {
                await supabase.from('accounts').insert({
                    user_id: user.id,
                    plaid_item_id: plaidItemId,
                    plaid_account_id: account.account_id,
                    name: account.name,
                    type: account.subtype || account.type, // Map subtype if possible, fallback to type
                    balance: account.balances.current || 0,
                    currency: account.balances.iso_currency_code || 'USD'
                });
            }
        }

        // 5. Fetch Recent Transactions (Initial Sync - last 30 days)
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const transactionsResponse = await plaidClient.transactionsGet({
            access_token: accessToken,
            start_date: startDate,
            end_date: endDate,
            options: {
                include_personal_finance_category: true,
            }
        });

        const transactions = transactionsResponse.data.transactions;

        // Map plaid_account_id to internal account_id
        const { data: dbAccounts } = await supabase
            .from('accounts')
            .select('id, plaid_account_id')
            .eq('plaid_item_id', plaidItemId);

        const accountMap = new Map();
        if (dbAccounts) {
            dbAccounts.forEach(acc => {
                if (acc.plaid_account_id) accountMap.set(acc.plaid_account_id, acc.id);
            });
        }

        console.log(`Plaid transactions fetched: ${transactions.length}`);

        // Process transactions
        for (const transaction of transactions) {
            const accountId = accountMap.get(transaction.account_id);
            if (!accountId) {
                console.warn(`Account ID not found for transaction: ${transaction.transaction_id}`);
                continue;
            }

            // Check if transaction exists
            const { data: existingTx } = await supabase
                .from('transactions')
                .select('id')
                .eq('plaid_transaction_id', transaction.transaction_id)
                .maybeSingle();

            if (!existingTx) {
                // Determine type and amount
                let type = 'expense';
                let amount = transaction.amount;
                if (amount < 0) {
                    type = 'income';
                    amount = Math.abs(amount);
                }

                // Handle Category
                let categoryId = null;
                const plaidCategoryName = transaction.category ? transaction.category[transaction.category.length - 1] : 'Uncategorized';

                // Find or create category
                const { data: existingCategory } = await supabase
                    .from('categories')
                    .select('id')
                    .eq('name', plaidCategoryName)
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (existingCategory) {
                    categoryId = existingCategory.id;
                } else {
                    const { data: newCategory, error: catError } = await supabase
                        .from('categories')
                        .insert({
                            user_id: user.id,
                            name: plaidCategoryName,
                            type: type, // infer type from transaction
                            color: '#3b82f6', // default color
                        })
                        .select('id')
                        .single();

                    if (catError) {
                        console.error('Error creating category:', catError);
                    }
                    if (newCategory) categoryId = newCategory.id;
                }

                if (categoryId) {
                    const { error: insertError } = await supabase.from('transactions').insert({
                        user_id: user.id,
                        account_id: accountId,
                        plaid_transaction_id: transaction.transaction_id,
                        category_id: categoryId,
                        amount: amount,
                        type: type,
                        description: transaction.name,
                        date: transaction.date,
                        payee: transaction.merchant_name || transaction.name,
                    });

                    if (insertError) {
                        console.error('Error inserting transaction:', insertError);
                    }
                } else {
                    console.warn(`Skipping transaction ${transaction.transaction_id} because category could not be determined.`);
                }
            }
        }

        return NextResponse.json({ message: 'Bank connected & data synced' });
    } catch (error: any) {
        console.error('Error exchanging token:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
