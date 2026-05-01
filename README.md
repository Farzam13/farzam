# Smart Home Care Matching Platform MVP

## Stack
Next.js App Router + Tailwind + Supabase + server-side PDFKit.

## Setup
1. Install dependencies: `pnpm install`
2. Add `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
3. Run SQL in `supabase-schema.sql`.
4. Seed caregivers in Supabase table.
5. Start app: `pnpm dev`

## Project Structure
- `app/intake`: multi-step 360 patient assessment form
- `app/api/match`: rule-based matching endpoint
- `app/api/generate-pdf`: care folder PDF generation
- `app/dashboard`: internal operations dashboard and assignment flow
- `lib/matching.ts`: matching engine
- `supabase-schema.sql`: DB schema

## Core Flow
1. Complete intake form
2. See “Analyzing your case...” state
3. Get top-2 matches + explanation
4. Download generated Care Information Folder PDF
5. Manage assignment from dashboard
