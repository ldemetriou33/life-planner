# Environment Variables Documentation

This document lists all environment variables required for the Reality Check application.

## Required for Production

### Payment System
- **`NEXT_PUBLIC_PAYPAL_CLIENT_ID`**
  - **Description:** PayPal client ID for payment processing
  - **Type:** String
  - **Required:** Yes (fallback available for development only)
  - **Example:** `ARN5klFaEsIMllSuqWN-fxKKuB1i-mk9TvKWW0hB6WVFAK05soxvKRNyJnFrhkGUox1Ib0-RLtkFvNvm`
  - **Note:** Get from [PayPal Developer Dashboard](https://developer.paypal.com/)
  - **Fallback:** Hardcoded fallback exists for development (not recommended for production)

### Database (Supabase)
- **`NEXT_PUBLIC_SUPABASE_URL`**
  - **Description:** Supabase project URL
  - **Type:** String
  - **Required:** Yes (for email storage)
  - **Example:** `https://your-project.supabase.co`
  - **Where to find:** Supabase Dashboard → Settings → API

- **`SUPABASE_SERVICE_ROLE_KEY`**
  - **Description:** Supabase service role key (for server-side operations)
  - **Type:** String (secret)
  - **Required:** Yes (for email storage)
  - **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - **Where to find:** Supabase Dashboard → Settings → API → service_role key
  - **Security:** Keep this secret! Never expose to client-side code.

- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** (Optional)
  - **Description:** Supabase anonymous key (fallback if service role not available)
  - **Type:** String
  - **Required:** No (only if service role key not set)
  - **Where to find:** Supabase Dashboard → Settings → API → anon key

### Email Notifications (Resend)
- **`RESEND_API_KEY`**
  - **Description:** Resend API key for sending email notifications
  - **Type:** String (secret)
  - **Required:** No (optional feature)
  - **Example:** `re_1234567890abcdef`
  - **Where to find:** [Resend Dashboard](https://resend.com/api-keys)

- **`RESEND_FROM_EMAIL`**
  - **Description:** Email address to send notifications from
  - **Type:** String (email)
  - **Required:** No (defaults to `onboarding@resend.dev`)
  - **Example:** `noreply@yourdomain.com`
  - **Note:** Must be verified in Resend dashboard

- **`ADMIN_EMAIL`**
  - **Description:** Email address to receive assessment notifications
  - **Type:** String (email)
  - **Required:** No (only if email notifications enabled)
  - **Example:** `admin@yourdomain.com`

### AI Enhancement (Google Gemini)
- **`GEMINI_API_KEY`**
  - **Description:** Google Gemini API key for AI-powered assessment enhancement
  - **Type:** String (secret)
  - **Required:** No (offline preset system works without it)
  - **Example:** `AIzaSy...`
  - **Where to find:** [Google AI Studio](https://makersuite.google.com/app/apikey)
  - **Note:** Enhancement only happens after payment/password unlock

## Optional Configuration

### Admin Access
- **`NEXT_PUBLIC_ADMIN_PASSWORD`**
  - **Description:** Password for admin panel access (`/admin`)
  - **Type:** String
  - **Required:** No (admin page shows warning if not set)
  - **Example:** `your-secure-password-123`
  - **Security:** Use a strong password in production

### Free Access Passwords
- **`NEXT_PUBLIC_FREE_ACCESS_PASSWORD`**
  - **Description:** Password for free premium access (general)
  - **Type:** String
  - **Required:** No
  - **Example:** `free-access-2024`
  - **Note:** Can be used in password input fields

- **`NEXT_PUBLIC_UNI_PASSWORD`**
  - **Description:** Special password for bottom unlock box
  - **Type:** String
  - **Required:** No
  - **Example:** `uni`
  - **Note:** Only works in bottom password box, not in payment sections

## Environment Setup

### Local Development

1. Create a `.env.local` file in the project root:
```bash
# Payment
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id

# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (Optional)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# AI (Optional)
GEMINI_API_KEY=your-gemini-api-key

# Admin & Passwords (Optional)
NEXT_PUBLIC_ADMIN_PASSWORD=your-admin-password
NEXT_PUBLIC_FREE_ACCESS_PASSWORD=your-free-password
NEXT_PUBLIC_UNI_PASSWORD=uni
```

2. Restart your development server:
```bash
npm run dev
```

### Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key:** Variable name (e.g., `NEXT_PUBLIC_PAYPAL_CLIENT_ID`)
   - **Value:** Variable value
   - **Environment:** Select `Production`, `Preview`, and/or `Development`

4. Redeploy your application for changes to take effect

### Environment Variable Naming

- **`NEXT_PUBLIC_*`**: Exposed to client-side code (browser)
  - Safe for public exposure
  - Accessible via `process.env.NEXT_PUBLIC_*`
  
- **No prefix**: Server-side only (secure)
  - Never exposed to client
  - Accessible only in API routes and server components

## Security Notes

1. **Never commit `.env.local` or `.env` files to git**
   - Already in `.gitignore`

2. **Use `NEXT_PUBLIC_*` prefix only for safe values**
   - PayPal client ID is safe (public)
   - API keys should NOT have this prefix

3. **Service role keys are secrets**
   - `SUPABASE_SERVICE_ROLE_KEY` - Keep secret
   - `GEMINI_API_KEY` - Keep secret
   - `RESEND_API_KEY` - Keep secret

4. **Passwords in `NEXT_PUBLIC_*` are client-visible**
   - `NEXT_PUBLIC_ADMIN_PASSWORD` - Visible in browser
   - `NEXT_PUBLIC_FREE_ACCESS_PASSWORD` - Visible in browser
   - Use strong passwords, but know they're not truly secret

## Fallback Behavior

The application gracefully handles missing environment variables:

- **PayPal**: Falls back to hardcoded client ID (development only)
- **Supabase**: Falls back to file storage (local only)
- **Gemini**: Falls back to offline preset system
- **Resend**: Email notifications simply don't send
- **Admin Password**: Admin page shows warning

## Verification

Check if variables are loaded:

1. **Development**: Check console logs on server startup
2. **Production**: Check Vercel function logs
3. **Client-side**: Use browser DevTools → Console → `process.env.NEXT_PUBLIC_*`

## Support

For issues with environment variables:
1. Verify variable names match exactly (case-sensitive)
2. Check for typos or extra spaces
3. Restart development server after changes
4. Redeploy on Vercel after adding variables
5. Check Vercel logs for errors
