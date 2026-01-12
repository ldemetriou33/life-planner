# Google Gemini API Setup Guide

## Step 1: Get Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (it will look like: `AIzaSy...`)

## Step 2: Add to Vercel (Production)

### Via Vercel Dashboard:

1. Go to your project on [Vercel Dashboard](https://vercel.com)
2. Click on your project → **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your API key (paste it here)
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your project (go to Deployments → Latest → Redeploy)

### Via Vercel CLI:

```bash
vercel env add GEMINI_API_KEY
# Paste your API key when prompted
# Select: Production, Preview, Development
vercel --prod
```

## Step 3: Add to Local Development (Optional)

1. Create `.env.local` file in the project root:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

3. Restart your dev server:
```bash
npm run dev
```

## Important Notes

- ✅ The app works **without** the API key (uses offline fallback)
- ✅ The API key is **optional** but enables AI-powered assessments
- ✅ Never commit `.env.local` to git (it's already in .gitignore)
- ✅ The API key is free for reasonable usage

## Testing

After adding the API key:
1. The app will try to use Gemini first
2. If Gemini fails, it falls back to the offline 6-phase engine
3. Check the browser console for any API errors

## Troubleshooting

**API key not working?**
- Make sure it's set in Vercel Environment Variables
- Redeploy after adding the variable
- Check the API key is correct (starts with `AIzaSy`)

**Rate limits?**
- Google Gemini has free tier limits
- The offline fallback will kick in automatically if limits are hit

