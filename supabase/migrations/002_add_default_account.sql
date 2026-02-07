-- Update the handle_new_user function to also create a default account
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- Insert default categories
  insert into public.categories (user_id, name, type, color) values
  (new.id, 'Food', 'expense', '#ef4444'),
  (new.id, 'Transport', 'expense', '#f97316'),
  (new.id, 'Utilities', 'expense', '#eab308'),
  (new.id, 'Entertainment', 'expense', '#8b5cf6'),
  (new.id, 'Shopping', 'expense', '#ec4899'),
  (new.id, 'Housing', 'expense', '#3b82f6'),
  (new.id, 'Salary', 'income', '#22c55e'),
  (new.id, 'Investments', 'income', '#10b981');

  -- Insert default account (New addition)
  insert into public.accounts (user_id, name, type, balance, currency) values
  (new.id, 'Cash', 'cash', 0.00, 'USD');

  return new;
end;
$$ language plpgsql security definer;
