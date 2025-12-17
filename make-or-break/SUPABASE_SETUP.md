# Supabase Setup Guide

This guide will help you set up Supabase for cloud sync functionality in the Make or Break habit tracker.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `make-or-break` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Choose the closest region to you
4. Click "Create new project" and wait for it to initialize

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Create the Database Schema

1. In your Supabase project, go to the SQL Editor
2. Click "New query"
3. Copy and paste the contents of `supabase-schema.sql`
4. Click "Run" to execute the SQL
5. Verify the tables were created by going to Table Editor

**Troubleshooting UUID Errors:**

If you get "invalid input syntax for type uuid" errors when syncing, the `id` column was created as UUID instead of TEXT.

**Quick Fix:**

1. Go to SQL Editor in Supabase
2. Copy and run the contents of `supabase-fix-uuid.sql`
3. This will change the column types from UUID to TEXT

Alternatively, you can drop and recreate the table:

```sql
DROP TABLE IF EXISTS habits CASCADE;
-- Then run the main schema.sql again
```

## Step 4: Configure Environment Variables

1. In your project root, create a `.env` file (if it doesn't exist)
2. Add the following:

```
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from Step 2.

**Important:** The `.env` file is already in `.gitignore` and will not be committed to version control.

## Step 5: Restart Your Development Server

After adding the environment variables, restart your Expo development server:

```bash
npm start
```

## How Sync Works

- **Offline-first**: All operations work without internet
- **WiFi sync**: Data syncs automatically when connected to WiFi
- **Background sync**: Sync happens in the background after habit operations
- **Conflict resolution**: Last write wins (based on updated_at timestamp)

## Testing Sync

1. Create some habits in the app
2. Connect to WiFi
3. Check the console logs for sync messages
4. Verify data in Supabase Table Editor

## Troubleshooting

### Sync not working?

1. Check that your `.env` file has the correct values
2. Verify the database schema was created correctly
3. Check the console for error messages
4. Ensure you're connected to WiFi (not just mobile data)

### Data not appearing in Supabase?

1. Check the `user_id` column - it should match your device ID
2. Verify the table structure matches the schema
3. Check Supabase logs for any errors

## Next Steps

- Consider implementing user authentication for multi-device sync
- Add sync status indicators in the UI
- Implement sync queue for failed operations
