# Supabase setup for HQ Manager

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. **New project** → choose organization → set name (e.g. `hq-manager`) and password → create.

## 2. Get your API keys

1. In the dashboard: **Settings** (gear) → **API**.
2. Copy:
   - **Project URL** → use as `VITE_SUPABASE_URL`
   - **anon public** key → use as `VITE_SUPABASE_ANON_KEY`

## 3. Create `.env` locally

In the project root (`HQ Manager/`), copy the example and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## 4. Create the table and RLS policies

1. In Supabase: **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` in this repo and copy its contents.
3. Paste into the SQL Editor and **Run**.

This creates the `hq_collection` table and policies so each user can only read/write their own row.

## 5. Enable Email auth (optional)

Supabase can require email confirmation. For personal use you can leave it as is or:

- **Authentication** → **Providers** → **Email**: enable "Confirm email" if you want, or disable to sign in right after sign-up.

## 6. Deploy (Vercel)

Add the same variables in Vercel so the deployed app can talk to Supabase:

1. Vercel → your project → **Settings** → **Environment Variables**.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the same values as in `.env`.
3. Redeploy so the build picks them up.

After that, sign up in the app and your collection will be stored in Supabase and synced across devices.
