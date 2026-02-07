-- Add plaid_access_token & plaid_item_id to profiles or create a new table if you prefer linking multiple banks per user.
-- Since one user can have multiple bank connections, a separate table is better.

CREATE TABLE IF NOT EXISTS plaid_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    item_id TEXT NOT NULL,
    institution_id TEXT,
    institution_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, institution_id) -- Prevent duplicate connections for same bank
);

-- Add RLS policies for plaid_items
ALTER TABLE plaid_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own plaid items" 
ON plaid_items FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plaid items" 
ON plaid_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plaid items" 
ON plaid_items FOR DELETE 
USING (auth.uid() = user_id);


-- Update accounts table to link to plaid_items
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS plaid_item_id UUID REFERENCES plaid_items(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS plaid_account_id TEXT;

-- update transactions table to link to plaid transaction id
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS plaid_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS category_id TEXT, -- Ensure this exists or is handled
ADD COLUMN IF NOT EXISTS pending BOOLEAN DEFAULT FALSE;

-- Create an index to perform lookups faster
CREATE INDEX IF NOT EXISTS idx_transactions_plaid_id ON transactions(plaid_transaction_id);
CREATE INDEX IF NOT EXISTS idx_accounts_plaid_id ON accounts(plaid_account_id);
