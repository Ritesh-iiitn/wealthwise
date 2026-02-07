-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Accounts table (Bank accounts, wallets)
create table public.accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  type text not null, -- 'checking', 'savings', 'credit', 'investment', 'cash'
  balance numeric(12, 2) default 0.00 not null,
  currency text default 'USD' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Accounts
alter table public.accounts enable row level security;

create policy "Users can view own accounts"
  on accounts for select
  using ( auth.uid() = user_id );

create policy "Users can insert own accounts"
  on accounts for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own accounts"
  on accounts for update
  using ( auth.uid() = user_id );

create policy "Users can delete own accounts"
  on accounts for delete
  using ( auth.uid() = user_id );

-- Categories table (Customizable transaction categories)
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  type text not null, -- 'income', 'expense'
  icon text, -- Lucide icon name or emoji
  color text, -- Hex code
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Categories
alter table public.categories enable row level security;

create policy "Users can view own categories"
  on categories for select
  using ( auth.uid() = user_id );

create policy "Users can insert own categories"
  on categories for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own categories"
  on categories for update
  using ( auth.uid() = user_id );

create policy "Users can delete own categories"
  on categories for delete
  using ( auth.uid() = user_id );

-- Transactions table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  account_id uuid references public.accounts on delete cascade not null,
  category_id uuid references public.categories on delete set null,
  amount numeric(12, 2) not null,
  type text not null, -- 'income', 'expense', 'transfer'
  description text not null,
  date date not null default CURRENT_DATE,
  payee text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Transactions
alter table public.transactions enable row level security;

create policy "Users can view own transactions"
  on transactions for select
  using ( auth.uid() = user_id );

create policy "Users can insert own transactions"
  on transactions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own transactions"
  on transactions for update
  using ( auth.uid() = user_id );

create policy "Users can delete own transactions"
  on transactions for delete
  using ( auth.uid() = user_id );

-- Budgets table
create table public.budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category_id uuid references public.categories on delete cascade not null,
  amount numeric(12, 2) not null,
  period text default 'monthly' not null, -- 'monthly', 'yearly'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Budgets
alter table public.budgets enable row level security;

create policy "Users can view own budgets"
  on budgets for select
  using ( auth.uid() = user_id );

create policy "Users can insert own budgets"
  on budgets for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own budgets"
  on budgets for update
  using ( auth.uid() = user_id );

create policy "Users can delete own budgets"
  on budgets for delete
  using ( auth.uid() = user_id );

-- Function to handle new user signup
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

  -- Insert default account
  insert into public.accounts (user_id, name, type, balance, currency) values
  (new.id, 'Cash', 'cash', 0.00, 'USD');

  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
