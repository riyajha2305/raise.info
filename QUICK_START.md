# Quick Start - Database Setup

## Problem

You're getting this error:

```
Error loading comments: Could not find the table 'public.comments' in the schema cache
```

## Solution

Run the SQL file to create all necessary tables.

## Steps

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://app.supabase.com/project/YOUR_PROJECT_ID
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `database_setup.sql`
5. Paste it into the SQL editor
6. Click "Run" or press Cmd/Ctrl + Enter
7. Wait for "Success" message

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run the SQL file
psql $(supabase status | grep DB_URL | awk '{print $3}') -f database_setup.sql
```

## What This Creates

✅ **Comments** table - for user comments on salary entries  
✅ **Replies** table - for replies to comments  
✅ **Salary_votes** table - for tracking upvotes/downvotes on salaries  
✅ Upvotes/downvotes columns on existing **salaries** table  
✅ All necessary indexes for performance  
✅ Row Level Security (RLS) policies  
✅ Triggers for automatic vote counting

## After Running SQL

1. Refresh your application
2. The error should be gone
3. Comments and votes will now work!

## Verify It Worked

Try these queries in the Supabase SQL Editor:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('comments', 'replies', 'salary_votes');

-- Should return 3 rows

-- Check if salaries has upvotes/downvotes
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'salaries'
AND column_name IN ('upvotes', 'downvotes');

-- Should return 2 rows
```

## Troubleshooting

**Error: "table already exists"**

- The table already exists, you can skip this step
- Or drop and recreate if needed

**Error: "permission denied"**

- Make sure you're using the service role or have proper permissions

**Still getting the error?**

- Clear browser cache and hard refresh (Cmd/Ctrl + Shift + R)
- Restart your Next.js dev server

