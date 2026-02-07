-- Add financial rules table (replaces generic budgets)
CREATE TABLE IF NOT EXISTS financial_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'savings_target', 'credit_limit', 'debt_reduction', 'liquidity_floor'
    target_value DECIMAL(12,2) NOT NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE, -- Link to specific account
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE financial_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own financial rules" 
ON financial_rules FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own financial rules" 
ON financial_rules FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financial rules" 
ON financial_rules FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financial rules" 
ON financial_rules FOR DELETE 
USING (auth.uid() = user_id);
