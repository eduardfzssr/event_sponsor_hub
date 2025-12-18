# Quick Reference Guide for Coding Agents

## What is EventSponsorHub?

A platform where companies can review event sponsorships, share ROI data, and make informed sponsorship decisions. Think "G2.com for event sponsorships."

## Core Concepts

### Three-Phase Launch
1. **Phase 1**: Compile public event data, publish benchmark reports
2. **Phase 2**: Launch searchable database with user accounts
3. **Phase 3**: Enable verified community reviews

### Subscription Tiers
- **Free**: 3 reviews/month, basic search
- **Pro**: Unlimited reviews, comparisons, ROI calculator
- **Team**: 5 seats, custom benchmarks
- **Enterprise**: API access, white-label reports

## Database Tables (Quick Reference)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User accounts | `id`, `email`, `subscription_tier` |
| `companies` | Company info | `id`, `name`, `industry` |
| `events` | Event listings | `id`, `name`, `slug`, `status` |
| `event_metrics` | Event analytics | `event_id`, `year`, `avg_roi`, `attendance` |
| `reviews` | User reviews | `id`, `event_id`, `user_id`, `rating`, `roi`, `status` |
| `review_verifications` | Verification tracking | `review_id`, `status`, `verification_type` |
| `review_helpful_votes` | Voting system | `review_id`, `user_id` |
| `subscriptions` | Subscription management | `user_id`, `tier`, `status` |
| `benchmark_reports` | PDF reports | `id`, `slug`, `file_url` |
| `event_comparisons` | Comparison feature | `user_id`, `event_ids[]` |

## Common Patterns

### Get Supabase Client

**Server Component:**
```typescript
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

**Client Component:**
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

### Check Authentication
```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/login')
```

### Check Subscription Tier
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('subscription_tier')
  .eq('id', user.id)
  .single()

const isPro = ['pro', 'team', 'enterprise'].includes(profile?.subscription_tier)
```

### Check Review Limit
```typescript
const { data: canReview } = await supabase.rpc('check_review_limit', {
  user_uuid: user.id
})
```

### Get Event with Stats
```typescript
const { data: event } = await supabase
  .from('events')
  .select(`
    *,
    event_metrics(*),
    reviews(count)
  `)
  .eq('id', eventId)
  .single()
```

### Get Published Reviews
```typescript
const { data: reviews } = await supabase
  .from('reviews')
  .select(`
    *,
    profiles(full_name, role),
    companies(name)
  `)
  .eq('event_id', eventId)
  .eq('status', 'published')
  .order('helpful_count', { ascending: false })
```

## Review Status Flow

```
draft → pending → published
         ↓
      rejected
```

- `draft`: User is writing
- `pending`: Submitted, awaiting verification
- `published`: Live and visible to public
- `rejected`: Failed verification or moderation

## Review Verification

1. User submits review → `status = 'pending'`
2. Create `review_verifications` record
3. User verifies via LinkedIn/email
4. Update `review_verifications.status = 'verified'`
5. Update `reviews.is_verified = true`
6. Update `reviews.status = 'published'`

## Key Functions

- `check_review_limit(user_uuid)` - Returns boolean
- `calculate_event_avg_roi(event_uuid)` - Returns decimal

## RLS Policies Summary

- **Public Read**: `events`, `event_metrics`, published `reviews`, `companies`, `profiles`
- **Authenticated Write**: Most tables allow authenticated inserts
- **User-Specific**: Users can only update/delete their own `reviews`, `profiles`, `subscriptions`

## File Locations

- **Database Schema**: `supabase/migrations/001_initial_schema.sql`
- **TypeScript Types**: `lib/database/types.ts`
- **Supabase Clients**: `lib/supabase/client.ts`, `lib/supabase/server.ts`
- **Middleware**: `middleware.ts` (root), `lib/supabase/middleware.ts`

## Important Notes

1. **RLS is always enabled** - Never bypass Row Level Security
2. **Only published reviews are public** - Filter by `status = 'published'`
3. **Subscription checks are required** - Use `check_review_limit()` function
4. **Triggers auto-update** - `helpful_count` and `avg_roi` are maintained automatically
5. **Verification is required** - Reviews must be verified before publishing (Phase 3)

## Common Queries

### Search Events
```typescript
const { data } = await supabase
  .from('events')
  .select('*')
  .ilike('name', `%${query}%`)
  .eq('status', 'upcoming')
  .order('start_date')
```

### Get User's Reviews
```typescript
const { data } = await supabase
  .from('reviews')
  .select('*, events(name, slug)')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
```

### Vote on Review
```typescript
const { error } = await supabase
  .from('review_helpful_votes')
  .insert({ review_id, user_id })
// helpful_count is auto-updated by trigger
```

## Error Handling

```typescript
const { data, error } = await supabase.from('events').select('*')

if (error) {
  console.error('Database error:', error)
  // Handle error appropriately
  return
}

// Use data
```

## Testing Checklist

When implementing features, verify:
- [ ] RLS policies allow/disallow access correctly
- [ ] Subscription tier checks work
- [ ] Review limits are enforced
- [ ] Triggers update related data
- [ ] Only published reviews are visible publicly
- [ ] Users can only modify their own data
