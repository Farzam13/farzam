# Home Care Management System (Multi-tenant SaaS MVP)

## Architecture
- Next.js App Router frontend + API routes
- Supabase Auth + Postgres + Row Level Security
- Multi-tenant data model with `clinic_id` isolation
- Role model: `admin`, `staff`

## Project Structure
- `app/intake` - 360 patient assessment intake
- `app/dashboard` - SaaS operations dashboard (stats + pipeline + patient management)
- `app/api/match` - caregiver ranking API
- `app/api/generate-pdf` - care plan PDF export
- `app/api/assign` - assignment endpoint
- `lib/matching.ts` - rule-based matching + risk classification
- `supabase-schema.sql` - tenant-aware schema + RLS policies

## Database Schema
Tables included:
- `clinics`
- `users`
- `patients`
- `caregivers`
- `matches`
- `care_plans`
- `leads`

## Matching Weights
- Clinical match: 50%
- Personality match: 30%
- Experience: 20%

## CRM Pipeline
`Lead → Assessment → Assigned → Active → Closed`

## Local Setup
1. `pnpm install`
2. Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
3. Run SQL from `supabase-schema.sql` in Supabase SQL editor.
4. Ensure authenticated users have a `users` profile row with `clinic_id` and `role`.
5. Seed sample caregivers and patients.
6. Run `pnpm dev`.

## Security
- RLS enabled on all tenant tables.
- Policies use `current_clinic_id()` helper to enforce clinic-level isolation.
