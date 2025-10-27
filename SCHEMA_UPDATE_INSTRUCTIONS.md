# Schema Update Instructions

## Changes Made

### 1. **Database Schema Updates**

The `schema_updates.sql` file contains SQL to add upvote/downvote functionality to the salaries table:

- Added `upvotes` and `downvotes` columns to `salaries` table
- Created `salary_votes` table to track individual user votes
- Added triggers to automatically update vote counts when votes are added/changed/deleted
- Set up Row Level Security (RLS) policies

### 2. **Code Updates**

#### src/app/page.tsx

- Updated interface to include `upvotes` and `downvotes` fields
- Modified fetch query to retrieve upvotes and downvotes from database
- Changed "Reports" column to "Votes" in the table
- Display upvotes (↑) and downvotes (↓) in the table

#### src/components/SalaryDetailsPanel.tsx

- Updated interface to include upvote/downvote fields
- Changed hardcoded `upvoteCount={91}` and `downvoteCount={6}` to use real data from `data.upvotes` and `data.downvotes`
- Now fetches actual vote counts from database

## How to Apply

### Step 1: Run Schema Updates

```bash
# Connect to your Supabase SQL editor and run the schema_updates.sql file
# Or use the Supabase CLI:
psql -h <your-supabase-host> -U postgres -d postgres -f schema_updates.sql
```

### Step 2: Restart Your Application

The code changes are already applied. You just need to:

```bash
npm run dev
```

## What This Fixes

1. **Hardcoded Vote Counts**: Previously showed static "91 upvotes, 6 downvotes". Now displays real data from database
2. **Database Schema**: Properly structured with:

   - `salaries.upvotes` and `salaries.downvotes` columns
   - `salary_votes` table to track individual votes
   - Automatic vote count updates via triggers
   - RLS policies for security

3. **Table Display**: The "Reports" column now shows "Votes" with upvote/downvote counts
   - Format: `↑ X` (green) / `↓ Y` (red)

## Current Data

The existing salary data will have upvotes=0 and downvotes=0 by default after running the SQL. Users can then vote on salary entries through the UI, and these will be tracked in the database.

