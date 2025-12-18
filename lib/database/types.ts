/**
 * Database Types
 * 
 * These types match the Supabase database schema.
 * For auto-generated types, run: npx supabase gen types typescript --project-id <project-id> > lib/database/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SubscriptionTier = 'free' | 'pro' | 'team' | 'enterprise'
export type SubscriptionStatus = 'active' | 'cancelled' | 'trial' | 'expired'
export type EventStatus = 'upcoming' | 'past' | 'cancelled'
export type ReviewStatus = 'draft' | 'pending' | 'published' | 'rejected'
export type Recommendation = 'recommended' | 'neutral' | 'avoid'
export type VerificationType = 'linkedin' | 'email' | 'manual'
export type VerificationStatus = 'pending' | 'verified' | 'failed'
export type MetricSource = 'public_data' | 'sponsor_interview' | 'review_aggregate'

export interface Company {
  id: string
  name: string
  industry: string | null
  revenue_range: string | null
  website: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string | null
  company_id: string | null
  linkedin_url: string | null
  avatar_url: string | null
  subscription_tier: SubscriptionTier
  subscription_status: SubscriptionStatus
  subscription_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  name: string
  slug: string
  description: string | null
  category: string | null
  start_date: string | null
  end_date: string | null
  location: string | null
  city: string | null
  country: string | null
  venue: string | null
  organizer_name: string | null
  organizer_website: string | null
  website_url: string | null
  thumbnail_url: string | null
  is_featured: boolean
  status: EventStatus
  created_at: string
  updated_at: string
}

export interface EventMetric {
  id: string
  event_id: string
  year: number
  attendance: number | null
  sponsor_count: number | null
  app_usage_rate: number | null
  avg_roi: number | null
  estimated_sponsor_budget_min: number | null
  estimated_sponsor_budget_max: number | null
  sponsorship_tiers: Json | null
  audience_demographics: Json | null
  source: MetricSource | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  event_id: string
  user_id: string
  company_id: string | null
  title: string
  content: string
  rating: number
  roi: number | null
  sponsorship_tier: string | null
  sponsorship_cost: number | null
  leads_generated: number | null
  deals_closed: number | null
  recommendation: Recommendation | null
  status: ReviewStatus
  is_verified: boolean
  verification_method: VerificationType | null
  helpful_count: number
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface ReviewVerification {
  id: string
  review_id: string
  verification_type: VerificationType
  verification_token: string | null
  verified_at: string | null
  verifier_id: string | null
  status: VerificationStatus
  created_at: string
}

export interface ReviewHelpfulVote {
  id: string
  review_id: string
  user_id: string
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  starts_at: string
  expires_at: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export interface BenchmarkReport {
  id: string
  title: string
  slug: string
  description: string | null
  file_url: string
  year: number
  is_gated: boolean
  download_count: number
  created_at: string
  updated_at: string
}

export interface ReportDownload {
  id: string
  report_id: string
  user_id: string | null
  email: string | null
  downloaded_at: string
}

export interface EventComparison {
  id: string
  user_id: string
  name: string | null
  event_ids: string[]
  created_at: string
  updated_at: string
}

// Database view types for common queries
export interface EventWithMetrics extends Event {
  metrics: EventMetric | null
  review_count: number | null
  average_rating: number | null
  average_roi: number | null
}

export interface ReviewWithDetails extends Review {
  event: Event | null
  user: Profile | null
  company: Company | null
}

// Insert types (omitting auto-generated fields)
export type CompanyInsert = Omit<Company, 'id' | 'created_at' | 'updated_at'>
export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>
export type EventInsert = Omit<Event, 'id' | 'created_at' | 'updated_at'>
export type EventMetricInsert = Omit<EventMetric, 'id' | 'created_at' | 'updated_at'>
export type ReviewInsert = Omit<Review, 'id' | 'created_at' | 'updated_at' | 'helpful_count' | 'published_at'>
export type ReviewVerificationInsert = Omit<ReviewVerification, 'id' | 'created_at' | 'verified_at'>
export type ReviewHelpfulVoteInsert = Omit<ReviewHelpfulVote, 'id' | 'created_at'>
export type SubscriptionInsert = Omit<Subscription, 'id' | 'created_at' | 'updated_at'>
export type BenchmarkReportInsert = Omit<BenchmarkReport, 'id' | 'created_at' | 'updated_at' | 'download_count'>
export type ReportDownloadInsert = Omit<ReportDownload, 'id' | 'downloaded_at'>
export type EventComparisonInsert = Omit<EventComparison, 'id' | 'created_at' | 'updated_at'>

// Update types (all fields optional except id)
export type CompanyUpdate = Partial<Omit<Company, 'id' | 'created_at'>> & { id: string }
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>> & { id: string }
export type EventUpdate = Partial<Omit<Event, 'id' | 'created_at'>> & { id: string }
export type EventMetricUpdate = Partial<Omit<EventMetric, 'id' | 'created_at'>> & { id: string }
export type ReviewUpdate = Partial<Omit<Review, 'id' | 'created_at' | 'helpful_count'>> & { id: string }
export type SubscriptionUpdate = Partial<Omit<Subscription, 'id' | 'created_at'>> & { id: string }
export type BenchmarkReportUpdate = Partial<Omit<BenchmarkReport, 'id' | 'created_at'>> & { id: string }
export type EventComparisonUpdate = Partial<Omit<EventComparison, 'id' | 'created_at'>> & { id: string }
