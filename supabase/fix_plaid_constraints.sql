-- 1. Fix plaid_items constraint
-- We need a named unique constraint for UPSERT to work
DO $$ 
BEGIN 
    -- Try to drop the constraint if it exists with a different name or auto-generated name
    -- We can't easily know the auto-generated name if we didn't name it, but let's try to enforce a specific name now.
    
    -- First, let's just try to add it. If it complains about data, we might need to clean up duplicates first.
    -- But assuming empty or clean table:
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'plaid_items_user_id_institution_id_key'
    ) THEN
        ALTER TABLE plaid_items 
        ADD CONSTRAINT plaid_items_user_id_institution_id_key UNIQUE (user_id, institution_id);
    END IF;
END $$;

-- 2. Fix accounts constraint
-- The route uses upsert on 'plaid_account_id', so it MUST be unique.
-- Previously we only added an index, which is not enough for upsert.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'accounts_plaid_account_id_key'
    ) THEN
        -- Ensure the column is unique
        ALTER TABLE accounts 
        ADD CONSTRAINT accounts_plaid_account_id_key UNIQUE (plaid_account_id);
    END IF;
END $$;
