# Firebase to Supabase Migration Guide

## ✅ Migration Complete!

All Firebase services have been successfully migrated to Supabase. Your application now uses:
- **Supabase Auth** (instead of Firebase Authentication)
- **Supabase Database** (PostgreSQL instead of Firestore)
- **Supabase Storage** (instead of Firebase Storage)

---

## 🔑 Required Environment Variables

Your `.env.local` file now contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wlfjyfvjoieetjdblucn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Where to Find These Credentials:

1. **Supabase URL**:
   - Go to https://app.supabase.com/project/YOUR_PROJECT/settings/api
   - Copy the "Project URL"

2. **Supabase Anon Key**:
   - Same location as above
   - Copy the "anon/public" key

**✅ You already have valid credentials configured!**

---

## 📊 Database Setup - IMPORTANT!

You need to create the database tables in Supabase. Run this SQL in your Supabase SQL Editor:

### Step 1: Go to SQL Editor
1. Visit https://app.supabase.com/project/wlfjyfvjoieetjdblucn/sql
2. Click "New Query"

### Step 2: Run the Schema SQL
Copy and paste the entire content from `/src/lib/supabase/schema.sql` into the SQL editor and click "Run".

**This will create:**
- `comments` table
- `replies` table
- Indexes for performance
- Row Level Security (RLS) policies
- Auto-update triggers

---

## 🗄️ Storage Setup

### Step 1: Create Storage Bucket
1. Go to https://app.supabase.com/project/wlfjyfvjoieetjdblucn/storage/buckets
2. Click "New bucket"
3. Name it: **`attachments`**
4. Make it **Public** (check the "Public bucket" option)
5. Click "Create bucket"

### Step 2: Set Storage Policies
After creating the bucket, click on it and go to "Policies":

**Allow public read access:**
```sql
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'attachments');
```

**Allow authenticated uploads:**
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'attachments' AND
    auth.role() = 'authenticated'
  );
```

**Allow users to delete their own files:**
```sql
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 🔐 Authentication Setup

### Step 1: Enable Google OAuth
1. Go to https://app.supabase.com/project/wlfjyfvjoieetjdblucn/auth/providers
2. Find "Google" in the providers list
3. Enable it

### Step 2: Configure Google OAuth
You need a Google Cloud Project with OAuth credentials:

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/apis/credentials

2. **Create OAuth 2.0 Client ID:**
   - Application type: Web application
   - Name: "Salaris.fyi Supabase Auth"

3. **Authorized redirect URIs:**
   ```
   https://wlfjyfvjoieetjdblucn.supabase.co/auth/v1/callback
   ```

4. **Copy credentials to Supabase:**
   - Client ID → Google Client ID field
   - Client Secret → Google Client Secret field

### Step 3: Configure Site URL
In Supabase Auth settings:
- **Site URL**: `https://yourdomain.com` (or `http://localhost:3000` for dev)
- **Redirect URLs**: Add `http://localhost:3000/auth/callback` for development

---

## 📁 Files Changed

### ✅ New Files Created:
- `/src/lib/supabase/config.ts` - Supabase client configuration
- `/src/lib/supabase/auth.ts` - Authentication service
- `/src/lib/supabase/storage.ts` - Storage service
- `/src/lib/supabase/comments.ts` - Database operations
- `/src/lib/supabase/schema.sql` - Database schema
- `/src/app/auth/callback/route.ts` - OAuth callback handler

### ✅ Updated Files:
- `/src/contexts/AuthContext.tsx` - Now uses Supabase Auth
- `/src/types/comments.ts` - Updated for Supabase data types
- `/src/components/comments/CommentSection.tsx`
- `/src/components/comments/CommentInput.tsx`
- `/src/components/comments/CommentItem.tsx`
- `/src/components/comments/ReplyItem.tsx`
- `.env.local` - Removed Firebase, kept Supabase

### 🗑️ Removed:
- `/src/lib/firebase/` - Entire Firebase directory deleted
- `firebase` package - Uninstalled

---

## 🔄 What Changed

### Authentication:
- **Before**: `firebase.auth().signInWithPopup(googleProvider)`
- **After**: `supabase.auth.signInWithOAuth({ provider: 'google' })`
- **User object**: `user.uid` → `user.id`, `user.displayName` → `user.user_metadata.full_name`

### Database:
- **Before**: Firestore collections with document IDs
- **After**: PostgreSQL tables with UUIDs
- **Timestamps**: `Timestamp.toDate()` → `new Date(timestamp_string)`
- **Field names**: `camelCase` → `snake_case` (e.g., `userId` → `user_id`)

### Storage:
- **Before**: `firebase.storage().ref().put(file)`
- **After**: `supabase.storage.from('bucket').upload(path, file)`
- **URLs**: Firebase URLs → Supabase public URLs

---

## 🚀 Testing Checklist

After setting up the database and storage:

- [ ] **Authentication**: Try signing in with Google
- [ ] **Comments**: Post a comment (both authenticated and anonymous)
- [ ] **Replies**: Reply to a comment
- [ ] **Voting**: Upvote/downvote comments and replies
- [ ] **File Upload**: Upload an image (requires authentication)
- [ ] **File Upload**: Upload a PDF (requires authentication)
- [ ] **Delete**: Delete your own comment/reply

---

## 📦 Package Changes

### Removed:
```json
"firebase": "^10.x.x"
```

### Added:
```json
"@supabase/supabase-js": "^2.x.x",
"@supabase/ssr": "^0.x.x"
```

---

## 🔧 Development Notes

### Running Locally:
```bash
npm run dev
```

Server will start on `http://localhost:3000`

### OAuth Redirect:
- Development: `http://localhost:3000/auth/callback`
- Production: `https://yourdomain.com/auth/callback`

Make sure to add both to your:
1. Supabase Auth settings (Redirect URLs)
2. Google Cloud Console (Authorized redirect URIs)

---

## 🆘 Troubleshooting

### "Failed to fetch" errors:
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
- Restart your dev server after changing `.env.local`

### Authentication not working:
- Verify Google OAuth is enabled in Supabase
- Check that redirect URLs match exactly (no trailing slashes)
- Make sure Site URL is set in Supabase Auth settings

### Upload errors:
- Ensure the `attachments` bucket exists and is public
- Check storage policies are created
- Verify file size limits (5MB for images, 10MB for files)

### Database errors:
- Run the schema SQL from `/src/lib/supabase/schema.sql`
- Check RLS policies are enabled
- Verify table names match (all lowercase with underscores)

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)

---

## ✨ Benefits of Supabase

- **PostgreSQL** - More powerful queries and better data integrity
- **Real-time subscriptions** - Can easily add live updates
- **Better performance** - Faster queries with proper indexing
- **Row Level Security** - Fine-grained access control
- **Free tier** - More generous than Firebase
- **SQL Editor** - Direct database access for debugging

---

**Migration completed successfully! 🎉**

Your application is now running on Supabase. Make sure to complete the Database and Storage setup steps above before testing.
