# Reality Check: Singularity Career Assessment

A brutal, reality-based career assessment tool that predicts your job's obsolescence timeline in the age of AI. Built with Next.js 14, TypeScript, and Framer Motion.

## Features

- **30-Year Obsolescence Roadmap**: 6-phase extinction engine based on Moravec's Paradox
- **Real-time Assessment**: Analyzes university + major combinations
- **Visual Timeline**: Interactive 30-year timeline (2026-2050) with phase markers
- **AI Integration**: Google Gemini API support with offline fallback
- **Cyber-Minimalist UI**: Dark theme with neon glows and glassmorphism

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: Google Gemini API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key (optional, for AI-powered assessments)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd university-scorer
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket

2. Import your repository on [Vercel](https://vercel.com)

3. Add environment variable:
   - `GEMINI_API_KEY`: Your Google Gemini API key

4. Deploy! Vercel will automatically build and deploy your app.

### Manual Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
  ├── api/assess/        # Assessment API endpoint
  ├── components/        # React components
  ├── data/             # Universities and degrees data
  └── page.tsx          # Main page
lib/
  └── constants.ts      # System prompts
styles/
  └── globals.css       # Global styles and animations
```

## The 6 Phases

1. **Phase 1: The Laptop Purge (2028)** - Digital jobs
2. **Phase 2: The Middleman Massacre (2031)** - Management/coordination
3. **Phase 3: The Expert Eclipse (2034)** - Expert knowledge work
4. **Phase 4: The Physical Breach (2037)** - Gross motor skills
5. **Phase 5: The Deep Moat Decay (2040)** - Fine motor skills
6. **Phase 6: The Human Premium (2050+)** - Human connection

## License

MIT

