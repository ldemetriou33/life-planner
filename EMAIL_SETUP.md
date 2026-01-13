# Email Notification Setup

The simplest way to track all email submissions - you'll receive an email notification every time someone submits their email address.

## How It Works

Every time someone submits their email on your site, you'll automatically receive an email notification with:
- Their email address
- University
- Major
- Timestamp

All emails will be in your inbox, searchable and organized. No database needed!

## Setup (2 minutes)

### 1. Create a Resend Account (Free)

1. Go to [resend.com](https://resend.com)
2. Sign up for free (100 emails/day free tier)
3. Verify your email address

### 2. Get Your API Key

1. In Resend dashboard, go to "API Keys"
2. Click "Create API Key"
3. Name it "Reality Check App"
4. Copy the API key (starts with `re_...`)

### 3. Add Environment Variables

#### For Local Development:

Create or update `.env.local`:

```env
RESEND_API_KEY=re_your_api_key_here
ADMIN_EMAIL=your-email@example.com
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**Note:** For `RESEND_FROM_EMAIL`, you can use:
- `onboarding@resend.dev` (works immediately, for testing)
- Your own domain email (requires domain verification in Resend)

#### For Vercel Production:

1. Go to your Vercel project → Settings → Environment Variables
2. Add these three variables:

   - **Name**: `RESEND_API_KEY`
     - **Value**: Your Resend API key
     - **Environments**: Production, Preview, Development

   - **Name**: `ADMIN_EMAIL`
     - **Value**: Your email address (where you want notifications)
     - **Environments**: Production, Preview, Development

   - **Name**: `RESEND_FROM_EMAIL` (optional)
     - **Value**: `onboarding@resend.dev` or your verified domain email
     - **Environments**: Production, Preview, Development

3. Click "Save"
4. Redeploy your app

## Viewing Emails

### Option 1: Your Email Inbox (Recommended)

Just check your email! Every submission creates a new email with subject:
```
New Assessment: [University] - [Major]
```

You can:
- Search your inbox for "New Assessment"
- Create a filter/label to organize them
- Export from your email client if needed

### Option 2: Admin Page

Visit `/admin` on your site to see a formatted view:
- Local: `http://localhost:3000/admin`
- Production: `https://your-domain.vercel.app/admin`

Note: The admin page shows emails from local file storage, which doesn't persist on Vercel. Your email inbox is the permanent record.

## Using Your Own Domain (Optional)

To send from your own domain (e.g., `noreply@yourdomain.com`):

1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Add your domain (e.g., `yourdomain.com`)
4. Add the DNS records Resend provides to your domain
5. Wait for verification (usually a few minutes)
6. Update `RESEND_FROM_EMAIL` to use your domain

## Troubleshooting

### Not receiving emails?

1. Check spam folder
2. Verify `ADMIN_EMAIL` is set correctly
3. Check Resend dashboard for delivery status
4. Verify API key is correct
5. Check Vercel function logs for errors

### Emails going to spam?

- Use your own verified domain for `RESEND_FROM_EMAIL`
- Add SPF/DKIM records (Resend provides these)

### Want to disable email notifications?

Just remove or don't set `RESEND_API_KEY` - the app will still work, it just won't send emails.

## Alternative: Gmail SMTP (Even Simpler)

If you prefer using Gmail directly instead of Resend:

1. Enable "App Passwords" in your Google Account
2. Use Gmail SMTP settings
3. Update the code to use nodemailer with Gmail

But Resend is recommended because:
- ✅ Free tier (100 emails/day)
- ✅ Better deliverability
- ✅ No need for app passwords
- ✅ Built for transactional emails

## That's It!

Once configured, you'll receive an email for every submission. All your leads will be in your inbox, searchable and organized. Perfect for when you start marketing!
