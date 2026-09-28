# Home Care Management System (Multi-tenant SaaS MVP)

## Architecture
- Multi-tenant by clinic (`clinic_id` on domain tables)
- Next.js App Router + Supabase Auth/DB/RLS + API Routes
- Role-based access (`admin`, `staff`) via `users` profile table

## Key Enhancements
1. Clinic-level scoring customization (`clinics.scoring_weights`).
2. Explainable matching output with weighted component breakdown.
3. Analytics dashboard with conversion and retention metrics.
4. Notifications system for high-risk patient alerts.

## Project Structure
- `app/dashboard` analytics + pipeline + alerts
- `app/intake` patient 360 assessment workflow
- `app/api/match` tenant-aware matching with clinic weights
- `app/api/generate-pdf` care plan export
- `lib/matching.ts` explainable scoring and risk logic
- `supabase-schema.sql` full SaaS schema and RLS

## Database Schema
Core tables:
- clinics (includes `scoring_weights`)
- users
- patients
- caregivers
- matches
- care_plans
- leads
- notifications

## Local Setup
1. `pnpm install`
2. Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
3. Apply `supabase-schema.sql`.
4. Create profile rows in `users` for authenticated accounts.
5. Run `pnpm dev`.

## Security
- RLS enabled for tenant tables.
- Policies enforce clinic scoping through `current_clinic_id()`.
