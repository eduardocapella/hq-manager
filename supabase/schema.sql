-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Creates the table and RLS policies so each user only sees/edits their own data.

-- Table: one row per user, stores their purchased edition numbers as an array.
create table if not exists public.hq_collection (
	user_id uuid primary key references auth.users(id) on delete cascade,
	purchased_editions integer[] not null default '{}'
);

-- Enable Row Level Security (RLS).
alter table public.hq_collection enable row level security;

-- Users can only read their own row.
create policy "Users can read own collection"
	on public.hq_collection
	for select
	using (auth.uid() = user_id);

-- Users can insert their own row (e.g. first time saving).
create policy "Users can insert own collection"
	on public.hq_collection
	for insert
	with check (auth.uid() = user_id);

-- Users can update their own row.
create policy "Users can update own collection"
	on public.hq_collection
	for update
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);
