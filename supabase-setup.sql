-- ==========================================
-- VOID CODING - SUPABASE DATABASE BOOTSTRAP
-- Copy and paste this script directly into your Supabase SQL Editor.
-- ==========================================

-- Enable any needed extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text not null,
    full_name text not null,
    avatar_url text,
    education_level text default 'Beginner',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SUBSCRIPTIONS TABLE
create table if not exists public.subscriptions (
    id text primary key default uuid_generate_v4()::text,
    user_id uuid references public.profiles(id) on delete cascade not null,
    plan text default 'free' check (plan in ('free', 'pro')),
    status text default 'active' check (status in ('active', 'cancelled', 'none')),
    razorpay_customer_id text,
    razorpay_subscription_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (user_id)
);

-- 3. PROJECTS TABLE
create table if not exists public.projects (
    id text primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    name text not null,
    title text,
    description text,
    status text default 'active' check (status in ('active', 'completed', 'archived')),
    prompt text,
    generated_code text,
    deployment_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. CHATS TABLE
create table if not exists public.chats (
    id text primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    project_id text references public.projects(id) on delete cascade,
    role text not null check (role in ('user', 'assistant')),
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. PROGRESS TABLE
create table if not exists public.progress (
    id text primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    lesson_id text not null,
    completion_percentage integer default 0 not null,
    completed_at timestamp with time zone,
    unique (user_id, lesson_id)
);

-- 6. BILLING HISTORY TABLE
create table if not exists public.billing_history (
    id text primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    amount integer not null, -- amount in INR (whole rupees or paise, API inserts whole INR)
    currency text default 'INR' not null,
    plan text not null,
    status text default 'success' not null,
    invoice_id text not null,
    payment_id text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on all tables
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.projects enable row level security;
alter table public.chats enable row level security;
alter table public.progress enable row level security;
alter table public.billing_history enable row level security;

-- ROW LEVEL SECURITY POLICIES --

-- Profiles policies
create policy "Users can view their own profile." 
    on public.profiles for select 
    using (auth.uid() = id);

create policy "Users can update their own profile." 
    on public.profiles for update 
    using (auth.uid() = id);

create policy "Users or system can insert profiles." 
    on public.profiles for insert 
    with check (true);

-- Subscriptions policies
create policy "Users can view their own subscription." 
    on public.subscriptions for select 
    using (auth.uid() = user_id);

create policy "Service role or user can manage subscription." 
    on public.subscriptions for all 
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Projects policies
create policy "Users can view their own projects." 
    on public.projects for select 
    using (auth.uid() = user_id);

create policy "Users can manage their own projects." 
    on public.projects for all 
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Chats policies
create policy "Users can view their own chats." 
    on public.chats for select 
    using (auth.uid() = user_id);

create policy "Users can manage their own chats." 
    on public.chats for all 
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Progress policies
create policy "Users can view their own progress." 
    on public.progress for select 
    using (auth.uid() = user_id);

create policy "Users can manage their own progress." 
    on public.progress for all 
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Billing History policies
create policy "Users can view their own billing history." 
    on public.billing_history for select 
    using (auth.uid() = user_id);

create policy "Users or system can manage billing history." 
    on public.billing_history for all 
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Database indexes for production performance scaling
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_projects_user on public.projects(user_id);
create index if not exists idx_chats_user_project on public.chats(user_id, project_id);
create index if not exists idx_progress_user_lesson on public.progress(user_id, lesson_id);
create index if not exists idx_billing_history_user on public.billing_history(user_id);

-- Optional trigger to auto-create profile on Auth Signup
-- This handles any direct Supabase Auth integrations safely
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, education_level)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Student'),
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=' || encode(hmac(new.email::bytea, 'void'::bytea, 'sha256'), 'hex'),
    coalesce(new.raw_user_meta_data->>'education_level', 'Beginner')
  ) on conflict (id) do nothing;

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active')
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
