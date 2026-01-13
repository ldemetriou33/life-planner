# Supabase Email Storage Setup

This guide will help you set up persistent email storage using Supabase. All emails will be saved permanently in a database and viewable in the Supabase dashboard.

## Why Supabase?

- **Persistent Storage**: Emails are stored in a database that persists across Vercel deployments
- **Easy Access**: View all emails in the Supabase dashboard with a nice table interface
- **Free Tier**: Generous free tier (500MB database, 2GB bandwidth)
- **Analytics Ready**: Query, filter, and analyze your data
- **Export Data**: Easy CSV/JSON export from dashboard
- **Scalable**: Handles thousands of submissions easily

## Setup Steps

### 1. Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (free)
3. Create a new project
4. Choose a region close to your users
5. Wait for the project to be created (~2 minutes)

### 2. Create the Emails Table

Once your project is ready:

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Paste this SQL and click "Run":

```sql
-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  university TEXT NOT NULL,
  major TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_emails_timestamp ON emails(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_emails_email ON emails(email);

-- Enable Row Level Security (RLS) - we'll allow service role to access
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to read/write
CREATE POLICY "Service role can manage emails"
  ON emails
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

5. Verify the table was created:
   - Go to "Table Editor" in the left sidebar
   - You should see the `emails` table with columns: id, email, university, major, timestamp, created_at

### 3. Get Your Supabase Credentials

1. In your Supabase project dashboard, click "Settings" (gear icon)
2. Click "API" in the left sidebar
3. You'll need two values:
   - **Project URL**: Found under "Project URL" (looks like `https://xxxxx.supabase.co`)
   - **Service Role Key**: Found under "Project API keys" → "service_role" key (⚠️ Keep this secret!)

### 4. Add Environment Variables

#### For Local Development:

Create or update `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional: Email notifications (bonus feature)
RESEND_API_KEY=re_your_api_key_here
ADMIN_EMAIL=your-email@example.com
RESEND_FROM_EMAIL=onboarding@resend.dev
```

#### For Vercel Production:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add these variables:

   **Required:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
     - **Value**: Your Supabase project URL
     - **Environments**: Production, Preview, Development

   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
     - **Value**: Your Supabase service role key
     - **Environments**: Production, Preview, Development

   **Optional (for email notifications):**
   - **Name**: `RESEND_API_KEY`
     - **Value**: Your Resend API key (if you want email notifications)
     - **Environments**: Production, Preview, Development

   - **Name**: `ADMIN_EMAIL`
     - **Value**: Your email address (where you want notifications)
     - **Environments**: Production, Preview, Development

4. Click "Save"
5. Redeploy your application (or it will auto-deploy on next push)

## Viewing Emails

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click "Table Editor" in the left sidebar
3. Select the `emails` table
4. View all emails in a nice table format
5. You can:
   - Filter and search
   - Export as CSV
   - Sort by any column
   - See real-time updates
   - Query with SQL

### Option 2: Admin Page

Visit `/admin` on your site to see a formatted view:
- Local: `http://localhost:3000/admin`
- Production: `https://your-domain.vercel.app/admin`

The admin page reads from Supabase, so it will show all emails stored in the database.

### Option 3: Email Notifications (Bonus)

If you configured Resend, you'll also receive email notifications for each submission. This gives you:
- Real-time alerts in your inbox
- Permanent storage in Supabase database
- Best of both worlds!

## Migration from File Storage

If you have existing emails in `data/emails.json`, you can migrate them:

1. Go to Supabase SQL Editor
2. Run this query (adjust the values):

```sql
INSERT INTO emails (email, university, major, timestamp)
VALUES 
  ('email1@example.com', 'University Name', 'Major Name', '2024-01-01T00:00:00Z'),
  ('email2@example.com', 'Another University', 'Another Major', '2024-01-02T00:00:00Z');
```

Or use the Supabase dashboard to import a CSV file.

## Analyzing Your Data

Once you have emails in Supabase, you can run queries like:

```sql
-- Count submissions by university
SELECT university, COUNT(*) as count 
FROM emails 
GROUP BY university 
ORDER BY count DESC;

-- Count submissions by major
SELECT major, COUNT(*) as count 
FROM emails 
GROUP BY major 
ORDER BY count DESC;

-- Recent submissions
SELECT * FROM emails 
ORDER BY timestamp DESC 
LIMIT 10;
```

## Troubleshooting

### Emails not saving?

1. Check that environment variables are set correctly
2. Verify the table exists in Supabase
3. Check Vercel function logs for errors
4. Ensure RLS policies allow service role access

### Can't see emails in dashboard?

1. Make sure you're looking at the correct project
2. Check the table name is `emails` (lowercase)
3. Refresh the page

### Still using file storage?

The system automatically falls back to file storage if Supabase isn't configured. Check:
- Environment variables are set
- Supabase project is active
- Service role key is correct

## Security Notes

- ⚠️ **Never commit** `SUPABASE_SERVICE_ROLE_KEY` to git
- The service role key bypasses RLS - keep it secret
- Only use service role key on the server side (already configured)
- Consider adding email validation/rate limiting in production

## Support

If you need help:
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
