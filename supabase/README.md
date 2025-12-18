# Supabase Database Setup

This directory contains database migrations and setup files for the EventSponsorHub platform.

## Getting Started

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Note your project URL and anon key from Settings > API

### 2. Configure Environment Variables

Copy the example environment file and add your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Then update `.env.local` with your Supabase project URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Database Migrations

You can run the migration in one of two ways:

#### Option A: Using Supabase Dashboard (Recommended for first-time setup)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run it in the SQL Editor

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Install Dependencies

```bash
npm install
# or
pnpm install
```

## Database Schema Overview

The database includes the following main tables:

- **profiles** - User profiles extending Supabase auth
- **companies** - Company/organization information
- **events** - Event listings
- **event_metrics** - Metrics and analytics for events
- **reviews** - User reviews of events
- **review_verifications** - Verification tracking for reviews
- **review_helpful_votes** - Helpful votes on reviews
- **subscriptions** - User subscription management
- **benchmark_reports** - Benchmark reports (Phase 1 lead magnet)
- **report_downloads** - Download tracking
- **event_comparisons** - Event comparison feature (Pro/Team)

## Row Level Security (RLS)

All tables have Row Level Security enabled with policies that:

- Allow public read access for published content
- Restrict write access to authenticated users
- Ensure users can only modify their own data
- Support subscription-based feature access

## Database Functions

The schema includes several helpful functions:

- `calculate_event_avg_roi(event_uuid)` - Calculates average ROI for an event
- `check_review_limit(user_uuid)` - Checks if user can write more reviews based on subscription tier
- `update_review_helpful_count()` - Automatically updates helpful_count when votes change
- `update_event_metrics_roi()` - Updates event metrics when reviews are published

## TypeScript Types

TypeScript types are available in `lib/database/types.ts`. For auto-generated types from your Supabase project, you can run:

```bash
npx supabase gen types typescript --project-id <project-id> > lib/database/types.ts
```

## Authentication

The middleware (`middleware.ts`) automatically handles session refresh for all routes. Protected routes should check authentication status using the Supabase client:

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  // Redirect to login
}
```

## Next Steps

1. Set up authentication providers in Supabase Dashboard (Settings > Authentication)
2. Configure email templates if using email authentication
3. Set up OAuth providers (LinkedIn) for review verification
4. Seed initial data (events, companies) for development

## Support

For issues or questions about the database schema, refer to the main plan document or Supabase documentation at [https://supabase.com/docs](https://supabase.com/docs).
