# Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variable:
```bash
vercel env add GEMINI_API_KEY
```
Enter your Gemini API key when prompted.

5. Redeploy with environment variable:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variable:**
   - In project settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key
   - Select "Production", "Preview", and "Development"

4. **Deploy:**
   - Click "Deploy"
   - Your site will be live in ~2 minutes!

## Other Deployment Options

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variable: `GEMINI_API_KEY`

### Railway

1. Connect GitHub repo
2. Auto-detects Next.js
3. Add `GEMINI_API_KEY` in variables

### Self-Hosted

1. Build: `npm run build`
2. Start: `npm start`
3. Set `GEMINI_API_KEY` environment variable

## Environment Variables

Required:
- `GEMINI_API_KEY`: Your Google Gemini API key (optional, app works without it using offline fallback)

## Post-Deployment

Your app will be available at: `https://your-project.vercel.app`

The offline fallback logic will work even without the Gemini API key, so the app is fully functional!

