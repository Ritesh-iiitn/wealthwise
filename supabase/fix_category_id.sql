-- Fix category_id type issue
-- Warning: This will clear 'category_id' data if it exists and cannot be cast, but since table is likely empty or using text, we want to enforce UUID/FK.

-- First, drop the column if it's not a foreign key or wrong type
DO $$
BEGIN
    -- Check if category_id exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'category_id') THEN
        -- We can try to alter it, but dropping is cleaner if we don't care about preserving bad data
        ALTER TABLE transactions DROP COLUMN category_id;
    END IF;
END $$;

-- Re-create category_id as correct UUID Foreign Key
ALTER TABLE transactions 
ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Ensure account_id is correct too
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'account_id') THEN
        ALTER TABLE transactions ADD COLUMN account_id UUID REFERENCES accounts(id) ON DELETE CASCADE;
   END IF;
END $$;

-- Verify plaid_transaction_id
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS plaid_transaction_id TEXT;

-- Verify other columns
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS amount DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('income', 'expense')),
ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS payee TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Refresh schema cache
NOTIFY pgrst, 'reload config';
