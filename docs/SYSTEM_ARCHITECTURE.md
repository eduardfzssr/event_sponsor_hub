# System Architecture Documentation

## Overview

EventSponsorHub is a Next.js application with Supabase as the backend database and authentication provider. The system is designed to support a three-phase launch strategy for an event sponsorship review platform.

## Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (via shadcn/ui)
- **State Management**: React hooks, Server Components

## Project Structure

```
event-sponsorship-reviews/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # User dashboard
│   ├── events/             # Event listing and detail pages
│   ├── admin/              # Admin panel
│   └── page.tsx            # Landing page
├── components/            # React components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility libraries
│   ├── supabase/          # Supabase client utilities
│   │   ├── client.ts      # Browser client
│   │   ├── server.ts      # Server client
│   │   └── middleware.ts  # Auth middleware
│   └── database/          # Database types
│       └── types.ts       # TypeScript types
├── supabase/              # Database migrations
│   └── migrations/        # SQL migration files
├── docs/                  # Documentation
│   ├── DATABASE_SCHEMA.md # Database schema docs
│   └── SYSTEM_ARCHITECTURE.md # This file
└── middleware.ts          # Next.js middleware
```

## Authentication Flow

### User Registration/Login

1. User clicks "Sign Up" or "Log In"
2. Supabase Auth handles authentication (email/password or OAuth)
3. On successful auth, Supabase creates `auth.users` record
4. Application creates/updates `profiles` record linked to `auth.users.id`
5. User session is stored in cookies (managed by `@supabase/ssr`)

### Session Management

- **Middleware** (`middleware.ts`) runs on every request
- Calls `updateSession()` from `lib/supabase/middleware.ts`
- Refreshes session if expired
- Sets/updates cookies for session persistence

### Protected Routes

Routes that require authentication should:
1. Get Supabase client: `const supabase = await createClient()`
2. Check user: `const { data: { user } } = await supabase.auth.getUser()`
3. Redirect if no user: `redirect('/login')`

## Data Flow

### Reading Data

#### Server Components
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'upcoming')
  
  return <EventsList events={events} />
}
```

#### Client Components
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

export function ClientComponent() {
  const supabase = createClient()
  // Use in useEffect, event handlers, etc.
}
```

### Writing Data

1. Validate input (client-side and server-side)
2. Check user permissions (subscription tier, review limits)
3. Insert/update via Supabase client
4. Handle errors and show feedback
5. Triggers automatically update related data (e.g., `helpful_count`)

## Three-Phase Launch Strategy

### Phase 1: Content Authority (Months 0-6)

**Database Tables Used:**
- `events` - Event listings
- `event_metrics` - Public data compilation
- `benchmark_reports` - Lead magnet PDFs
- `report_downloads` - Email capture

**Features:**
- Compile public data on 100-200 major events
- Interview sponsors for anonymized ROI data
- Publish benchmark report (gated behind email)
- No user authentication required for viewing

**Data Sources:**
- Public data (press releases, case studies)
- Sponsor interviews
- Organizer reports

### Phase 2: Database MVP (Months 6-12)

**Database Tables Used:**
- All Phase 1 tables
- `profiles` - User accounts
- `companies` - Company information
- `subscriptions` - Subscription management

**Features:**
- Searchable event database
- Basic analytics (event comparison, sponsor benchmarking)
- User accounts with free tier
- Beta testing with 100 marketing directors

**New Capabilities:**
- User registration/login
- Event search and filtering
- Basic event comparison (limited to Pro tier)
- Subscription management

### Phase 3: Community Reviews (Months 12+)

**Database Tables Used:**
- All previous tables
- `reviews` - User reviews
- `review_verifications` - Verification tracking
- `review_helpful_votes` - Voting system

**Features:**
- Verified review functionality
- LinkedIn/email verification
- Helpful voting system
- Full subscription tiers (Free, Pro, Team, Enterprise)

**Verification Process:**
1. User writes review (status: `draft`)
2. User submits for verification
3. System creates `review_verifications` record
4. User verifies via LinkedIn or email
5. Review status changes to `published`
6. Review appears publicly

## Subscription Tiers

### Free Tier
- **Limits**: 3 reviews/month
- **Features**: Basic event search, view published reviews
- **Database**: `subscriptions.tier = 'free'`

### Pro Tier ($149/month)
- **Limits**: Unlimited reviews
- **Features**: All free features + comparisons, ROI calculator, data export
- **Database**: `subscriptions.tier = 'pro'`

### Team Tier ($299/month)
- **Limits**: 5 seats, unlimited reviews
- **Features**: All Pro features + custom benchmarks, integrations
- **Database**: `subscriptions.tier = 'team'`

### Enterprise Tier ($999+/month)
- **Limits**: Unlimited seats
- **Features**: All Team features + API access, white-label reports
- **Database**: `subscriptions.tier = 'enterprise'`

## Key Workflows

### Review Creation Workflow

```
1. User navigates to event detail page
2. User clicks "Write Review"
3. Check subscription limit: check_review_limit(user_id)
4. If allowed:
   - Show review form
   - User fills in review data
   - Save to reviews table (status: 'draft')
5. User submits for verification
   - Create review_verifications record
   - Send verification email or LinkedIn OAuth
6. User verifies
   - Update review_verifications.status = 'verified'
   - Update reviews.is_verified = true
7. Review published
   - Update reviews.status = 'published'
   - Trigger updates event_metrics.avg_roi
```

### Event Search Workflow

```
1. User enters search query
2. Query events table with filters:
   - Text search on name, location
   - Category filter
   - Date range filter
   - Status filter
3. Join with event_metrics for latest year
4. Calculate aggregates:
   - Review count
   - Average rating
   - Average ROI
5. Return paginated results
6. Display with sorting options
```

### Subscription Management Workflow

```
1. User signs up → profiles.subscription_tier = 'free'
2. User upgrades to Pro:
   - Create subscription record
   - Update profiles.subscription_tier = 'pro'
   - Set profiles.subscription_expires_at
3. On subscription renewal:
   - Update subscription record
   - Update profiles.subscription_expires_at
4. On cancellation:
   - Update subscription.status = 'cancelled'
   - Keep access until expires_at
5. On expiration:
   - Update profiles.subscription_tier = 'free'
   - Update profiles.subscription_status = 'expired'
```

## API Patterns

### Server Actions (Recommended)

```typescript
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createReview(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')
  
  // Check review limit
  const { data: canReview } = await supabase.rpc('check_review_limit', {
    user_uuid: user.id
  })
  
  if (!canReview) throw new Error('Review limit reached')
  
  // Insert review
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      event_id: formData.get('event_id'),
      user_id: user.id,
      title: formData.get('title'),
      content: formData.get('content'),
      rating: parseInt(formData.get('rating')),
      status: 'draft'
    })
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/dashboard')
  return data
}
```

### Route Handlers (Alternative)

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'upcoming')
  
  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
  
  return NextResponse.json({ data })
}
```

## Error Handling

### Database Errors
- Use try/catch blocks
- Check `error` from Supabase responses
- Log errors for debugging
- Show user-friendly error messages

### Authentication Errors
- Redirect to login if unauthorized
- Show error messages for failed login
- Handle session expiration gracefully

### Validation Errors
- Validate on client-side (UX)
- Validate on server-side (security)
- Use Zod for schema validation

## Performance Considerations

### Database Queries
- Use indexes (already created in schema)
- Limit result sets with `.limit()`
- Use `.select()` to fetch only needed fields
- Use pagination for large datasets

### Caching
- Use Next.js `revalidatePath()` after mutations
- Consider `revalidateTag()` for time-based revalidation
- Use Supabase caching where appropriate

### Image Optimization
- Use Next.js Image component
- Store images in Supabase Storage
- Use CDN for public assets

## Security Best Practices

1. **Always use RLS** - Never disable Row Level Security
2. **Validate server-side** - Don't trust client-side validation
3. **Check permissions** - Verify subscription tier before premium features
4. **Sanitize inputs** - Prevent SQL injection (Supabase handles this)
5. **Rate limiting** - Consider rate limiting for API endpoints
6. **HTTPS only** - Ensure all connections are encrypted

## Deployment Checklist

- [ ] Set environment variables in production
- [ ] Run database migrations
- [ ] Configure Supabase Auth providers
- [ ] Set up email templates
- [ ] Configure OAuth providers (LinkedIn)
- [ ] Set up Stripe for payments (if applicable)
- [ ] Configure CORS in Supabase
- [ ] Set up monitoring and error tracking
- [ ] Configure backups
- [ ] Test RLS policies in production

## Monitoring & Analytics

### Key Metrics to Track
- User registrations
- Review creation rate
- Subscription conversions
- Event search queries
- Report downloads
- Review verification rate

### Tools
- Supabase Dashboard for database metrics
- Vercel Analytics (already configured)
- Custom analytics events in application

## Future Enhancements

1. **Real-time features** - Use Supabase Realtime for live updates
2. **Full-text search** - Implement PostgreSQL full-text search
3. **Recommendations** - ML-based event recommendations
4. **Notifications** - Email/push notifications
5. **API** - Public API for enterprise customers
6. **Mobile app** - React Native app using same Supabase backend
