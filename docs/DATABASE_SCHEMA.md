# Database Schema Documentation

## Overview

This document describes the database schema for EventSponsorHub, a platform for event sponsorship reviews and ROI insights. The system supports a three-phase launch strategy: content authority, database MVP, and community reviews.

## Architecture Diagram

```
┌─────────────────┐
│   auth.users    │ (Supabase Auth)
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│    profiles     │──────│  companies   │
└────────┬────────┘      └──────────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌─────────────────┐  ┌──────────────┐
│  subscriptions  │  │   reviews    │
└─────────────────┘  └──────┬────────┘
                           │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│review_verifications│ │review_helpful│  │    events   │
└──────────────────┘  │    _votes    │  └──────┬───────┘
                     └──────────────┘         │
                                              ▼
                                     ┌──────────────────┐
                                     │  event_metrics   │
                                     └──────────────────┘

┌──────────────────┐      ┌──────────────────┐
│benchmark_reports │      │event_comparisons │
└────────┬─────────┘      └──────────────────┘
         │
         ▼
┌──────────────────┐
│report_downloads  │
└──────────────────┘
```

## Core Entities

### 1. Users & Authentication

#### `profiles` (extends `auth.users`)
User profiles that extend Supabase's built-in authentication.

**Key Fields:**
- `id` - UUID, references `auth.users(id)`
- `email` - User email address
- `full_name` - User's full name
- `role` - Job title (e.g., "Marketing Director", "VP Partnerships")
- `company_id` - Foreign key to `companies` table
- `subscription_tier` - One of: `free`, `pro`, `team`, `enterprise`
- `subscription_status` - One of: `active`, `cancelled`, `trial`, `expired`

**Relationships:**
- One-to-one with `auth.users`
- Many-to-one with `companies`
- One-to-many with `reviews`
- One-to-many with `subscriptions`

**Business Logic:**
- Subscription tier determines feature access:
  - `free`: 3 reviews/month, basic event search
  - `pro`: Unlimited reviews, comparisons, ROI calculator
  - `team`: 5 seats, custom benchmarks
  - `enterprise`: API access, white-label reports

#### `companies`
Company/organization information.

**Key Fields:**
- `name` - Company name
- `industry` - Industry sector
- `revenue_range` - Revenue bracket (e.g., "$10M-$50M")

**Relationships:**
- One-to-many with `profiles`
- One-to-many with `reviews`

### 2. Events

#### `events`
Event listings and basic information.

**Key Fields:**
- `name` - Event name (e.g., "Web Summit 2024")
- `slug` - URL-friendly identifier (unique)
- `category` - Event category (e.g., "Tech Conference", "B2B Conference")
- `start_date`, `end_date` - Event dates
- `location`, `city`, `country` - Geographic information
- `status` - One of: `upcoming`, `past`, `cancelled`
- `is_featured` - Boolean for featured events

**Relationships:**
- One-to-many with `event_metrics` (one metric per year)
- One-to-many with `reviews`
- Many-to-many with `profiles` (via `reviews`)

**Indexes:**
- `name`, `category`, `start_date`, `location`, `slug` for fast search

#### `event_metrics`
Metrics and analytics for events (Phase 1: public data compilation).

**Key Fields:**
- `event_id` - Foreign key to `events`
- `year` - Year of the event
- `attendance` - Number of attendees
- `sponsor_count` - Number of sponsors
- `app_usage_rate` - Percentage of attendees using event app
- `avg_roi` - Average ROI (calculated from reviews)
- `estimated_sponsor_budget_min/max` - Budget range
- `sponsorship_tiers` - JSONB array of tiers (e.g., ["Platinum", "Gold"])
- `audience_demographics` - JSONB object with demographic data
- `source` - One of: `public_data`, `sponsor_interview`, `review_aggregate`

**Relationships:**
- Many-to-one with `events` (unique constraint on `event_id` + `year`)

**Business Logic:**
- `avg_roi` is automatically calculated from published reviews via trigger
- Multiple sources can contribute data for the same event/year

### 3. Reviews

#### `reviews`
User reviews of events (Phase 3: verified reviews).

**Key Fields:**
- `event_id` - Foreign key to `events`
- `user_id` - Foreign key to `profiles`
- `company_id` - Foreign key to `companies`
- `title` - Review title
- `content` - Review text content
- `rating` - Integer 1-5
- `roi` - Return on investment multiplier (e.g., 3.8x)
- `sponsorship_tier` - Tier sponsored (e.g., "Platinum", "Gold")
- `sponsorship_cost` - Cost in USD
- `leads_generated` - Number of leads
- `deals_closed` - Number of deals closed
- `recommendation` - One of: `recommended`, `neutral`, `avoid`
- `status` - One of: `draft`, `pending`, `published`, `rejected`
- `is_verified` - Boolean indicating verification status
- `verification_method` - One of: `linkedin`, `email`, `manual`
- `helpful_count` - Number of helpful votes (auto-updated)

**Relationships:**
- Many-to-one with `events`
- Many-to-one with `profiles`
- Many-to-one with `companies`
- One-to-many with `review_verifications`
- One-to-many with `review_helpful_votes`

**Business Logic:**
- Only `published` reviews are visible to public
- `helpful_count` is automatically maintained via trigger
- Reviews must be verified before publishing (Phase 3)
- Subscription tier limits review creation (checked via `check_review_limit()` function)

#### `review_verifications`
Verification tracking for reviews.

**Key Fields:**
- `review_id` - Foreign key to `reviews`
- `verification_type` - One of: `linkedin`, `email`, `manual`
- `verification_token` - Token for email verification
- `status` - One of: `pending`, `verified`, `failed`
- `verified_at` - Timestamp when verified

**Relationships:**
- Many-to-one with `reviews`

**Business Logic:**
- LinkedIn verification: User connects LinkedIn account
- Email verification: Token sent to user's email
- Manual verification: Admin verifies review

#### `review_helpful_votes`
User votes on review helpfulness.

**Key Fields:**
- `review_id` - Foreign key to `reviews`
- `user_id` - Foreign key to `profiles`

**Relationships:**
- Many-to-one with `reviews`
- Many-to-one with `profiles`

**Constraints:**
- Unique constraint on `(review_id, user_id)` - one vote per user per review

**Business Logic:**
- Trigger automatically updates `reviews.helpful_count` when votes change

### 4. Subscriptions

#### `subscriptions`
User subscription management.

**Key Fields:**
- `user_id` - Foreign key to `profiles`
- `tier` - One of: `free`, `pro`, `team`, `enterprise`
- `status` - One of: `active`, `cancelled`, `expired`, `trial`
- `starts_at`, `expires_at` - Subscription period
- `stripe_subscription_id` - Stripe subscription ID (if using Stripe)

**Relationships:**
- Many-to-one with `profiles`

**Business Logic:**
- Active subscription determines feature access
- `profiles.subscription_tier` should be kept in sync with active subscription

### 5. Content & Reports

#### `benchmark_reports`
Benchmark reports (Phase 1: lead magnet).

**Key Fields:**
- `title` - Report title
- `slug` - URL-friendly identifier (unique)
- `file_url` - PDF download URL
- `year` - Report year
- `is_gated` - Boolean, requires email signup if true
- `download_count` - Number of downloads

**Relationships:**
- One-to-many with `report_downloads`

#### `report_downloads`
Download tracking for benchmark reports.

**Key Fields:**
- `report_id` - Foreign key to `benchmark_reports`
- `user_id` - Foreign key to `profiles` (nullable)
- `email` - Email address (for non-authenticated downloads)

**Relationships:**
- Many-to-one with `benchmark_reports`
- Many-to-one with `profiles` (nullable)

### 6. Advanced Features

#### `event_comparisons`
Event comparison feature (Pro/Team tier).

**Key Fields:**
- `user_id` - Foreign key to `profiles`
- `name` - Comparison name (optional)
- `event_ids` - Array of event UUIDs

**Relationships:**
- Many-to-one with `profiles`

**Business Logic:**
- Only accessible to `pro`, `team`, or `enterprise` subscribers

## Database Functions

### `calculate_event_avg_roi(event_uuid UUID)`
Calculates the average ROI for an event from all published reviews.

**Returns:** `DECIMAL(5,2)` - Average ROI value

**Usage:**
```sql
SELECT calculate_event_avg_roi('event-uuid-here');
```

### `check_review_limit(user_uuid UUID)`
Checks if a user can write more reviews based on their subscription tier.

**Returns:** `BOOLEAN` - `true` if user can write more reviews

**Logic:**
- `free`: 3 reviews/month
- `pro`, `team`, `enterprise`: Unlimited

**Usage:**
```sql
SELECT check_review_limit('user-uuid-here');
```

### `update_review_helpful_count()`
Trigger function that automatically updates `reviews.helpful_count` when votes are added/removed.

**Automatically called by triggers on `review_helpful_votes` table.**

### `update_event_metrics_roi()`
Trigger function that updates `event_metrics.avg_roi` when a review with ROI is published.

**Automatically called by trigger on `reviews` table when status changes to `published`.**

## Row Level Security (RLS) Policies

### Public Read Access
- `events` - All events visible to everyone
- `event_metrics` - All metrics visible to everyone
- `reviews` - Only `published` reviews visible to everyone
- `benchmark_reports` - All reports visible to everyone
- `companies` - All companies visible to everyone
- `profiles` - All profiles visible to everyone (for display purposes)

### Authenticated Write Access
- Users can create reviews, companies, subscriptions
- Users can vote on reviews
- Users can download reports

### User-Specific Access
- Users can only update/delete their own:
  - `profiles`
  - `reviews`
  - `subscriptions`
  - `event_comparisons`

## Data Flow Examples

### Creating a Review

1. User creates review → `reviews` table (status: `draft`)
2. User submits for verification → `review_verifications` table (status: `pending`)
3. Verification completed → `review_verifications.status` = `verified`, `reviews.is_verified` = `true`
4. Review published → `reviews.status` = `published`
5. Trigger fires → `update_event_metrics_roi()` updates `event_metrics.avg_roi`

### Subscription Check Flow

1. User attempts to create review
2. Application calls `check_review_limit(user_id)`
3. Function checks:
   - User's subscription tier from `profiles.subscription_tier`
   - Current month's review count from `reviews`
   - Returns `true` if under limit, `false` otherwise
4. Application allows/denies review creation

### Event Search Flow

1. User searches events
2. Query `events` table with filters (category, location, date)
3. Join with `event_metrics` to get latest year's metrics
4. Calculate aggregate stats:
   - Review count from `reviews` (where status = `published`)
   - Average rating from `reviews.rating`
   - Average ROI from `event_metrics.avg_roi` or calculate from reviews
5. Return results sorted by relevance/rating

## Common Queries

### Get Event with Metrics and Review Stats

```sql
SELECT 
  e.*,
  em.attendance,
  em.sponsor_count,
  em.avg_roi,
  COUNT(r.id) as review_count,
  AVG(r.rating) as average_rating
FROM events e
LEFT JOIN event_metrics em ON e.id = em.event_id 
  AND em.year = EXTRACT(YEAR FROM e.start_date)
LEFT JOIN reviews r ON e.id = r.event_id 
  AND r.status = 'published'
WHERE e.id = $1
GROUP BY e.id, em.id;
```

### Get User's Reviews

```sql
SELECT 
  r.*,
  e.name as event_name,
  e.slug as event_slug,
  c.name as company_name
FROM reviews r
JOIN events e ON r.event_id = e.id
LEFT JOIN companies c ON r.company_id = c.id
WHERE r.user_id = $1
ORDER BY r.created_at DESC;
```

### Get Published Reviews for Event

```sql
SELECT 
  r.*,
  p.full_name,
  p.role,
  c.name as company_name,
  c.industry
FROM reviews r
JOIN profiles p ON r.user_id = p.id
LEFT JOIN companies c ON r.company_id = c.id
WHERE r.event_id = $1
  AND r.status = 'published'
ORDER BY r.helpful_count DESC, r.published_at DESC;
```

## Indexes for Performance

### Events
- `name` - Full-text search
- `category` - Filtering
- `start_date` - Date range queries
- `location` - Geographic search
- `slug` - URL lookups
- `status` - Filtering by status

### Reviews
- `event_id` - Get reviews for event
- `user_id` - Get user's reviews
- `status` - Filter by status
- `rating` - Sort by rating
- `published_at` - Sort by publication date
- `is_verified` - Filter verified reviews

### Event Metrics
- `event_id` + `year` - Unique constraint for fast lookups

## Migration Notes

The initial schema is in `supabase/migrations/001_initial_schema.sql`. This includes:
- All table definitions
- All indexes
- All functions
- All triggers
- All RLS policies

To apply:
1. Copy SQL to Supabase SQL Editor
2. Run the migration
3. Verify tables are created correctly

## TypeScript Types

Type definitions are in `lib/database/types.ts`. These include:
- All table types
- Insert types (omitting auto-generated fields)
- Update types (partial with required id)
- Common query result types

## Security Considerations

1. **RLS is enabled on all tables** - Never disable RLS
2. **Public read access is limited** - Only published content is public
3. **User data is protected** - Users can only modify their own data
4. **Subscription checks** - Always verify subscription tier before allowing premium features
5. **Verification required** - Reviews should be verified before publishing (Phase 3)

## Future Enhancements

Potential additions:
- `event_categories` - Normalized category table
- `sponsorship_packages` - Detailed package information
- `user_favorites` - Saved events
- `notifications` - User notifications
- `analytics_events` - User behavior tracking
