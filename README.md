# Egg Digital - Dynamic Creative Intelligence Platform

AI-powered marketing creative studio that generates audience-specific advertising visuals using Google Gemini.

## Features

- **Reference Image Upload** - Drag-and-drop with preview
- **Brand CI Upload** - PDF brand guidelines extraction
- **8 Audience Segments** - Health & Wellness, Young Professionals, Outdoor Seekers, Eco-Conscious, Gen Z, Busy Parents, Premium/Luxury, Active Seniors
- **Aspect Ratio Selection** - Auto, 1:1 (Square), 16:9 (Landscape), 9:16 (Portrait)
- **Edit Area Selection** - Actor, Background, Text modifications
- **AI Image Generation** - Powered by Google Gemini API
- **Download** - Individual images or ZIP archive

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, Zustand, shadcn/ui |
| Backend | Python (Vercel Serverless Functions) |
| AI | Google Gemini 2.0 Flash Exp |
| Deploy | Vercel |

## Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/EkoCommunications/egg-digital-creative-studio)

### Option 2: CLI Deploy
```bash
npm install
npx vercel login
npx vercel --yes --prod
```

### Environment Variables (set in Vercel Dashboard)
```
GOOGLE_AI_STUDIO_API_KEY=your-gemini-api-key
```

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
creative-studio-app/
├── api/                    # Vercel Python serverless functions
│   ├── _lib/              # Shared Python utilities
│   │   ├── cors.py        # CORS helpers
│   │   ├── gemini_client.py  # Gemini API client
│   │   ├── prompt_builder.py # Prompt construction
│   │   └── segments_data.py  # Segment definitions
│   ├── generate.py        # POST /api/generate
│   ├── health.py          # GET /api/health
│   ├── history.py         # GET /api/history
│   └── segments.py        # GET /api/segments
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── store/            # Zustand state management
│   ├── api/              # API client
│   └── hooks/            # Custom hooks
├── vercel.json           # Vercel configuration
└── package.json
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/segments | List audience segments |
| POST | /api/generate | Generate images for segments |
| GET | /api/history | Generation history |
