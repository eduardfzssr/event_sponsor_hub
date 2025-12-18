-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for secure random functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLES
-- ============================================

-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  revenue_range TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  linkedin_url TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'team', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'trial', 'expired')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT,
  start_date DATE,
  end_date DATE,
  location TEXT,
  city TEXT,
  country TEXT,
  venue TEXT,
  organizer_name TEXT,
  organizer_website TEXT,
  website_url TEXT,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'past', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event metrics table (Phase 1: public data compilation)
CREATE TABLE event_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  attendance INTEGER,
  sponsor_count INTEGER,
  app_usage_rate DECIMAL(5,2),
  avg_roi DECIMAL(5,2),
  estimated_sponsor_budget_min INTEGER,
  estimated_sponsor_budget_max INTEGER,
  sponsorship_tiers JSONB,
  audience_demographics JSONB,
  source TEXT CHECK (source IN ('public_data', 'sponsor_interview', 'review_aggregate')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, year)
);

-- Reviews table (Phase 3: verified reviews)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  roi DECIMAL(5,2),
  sponsorship_tier TEXT,
  sponsorship_cost INTEGER,
  leads_generated INTEGER,
  deals_closed INTEGER,
  recommendation TEXT CHECK (recommendation IN ('recommended', 'neutral', 'avoid')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'rejected')),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_method TEXT CHECK (verification_method IN ('linkedin', 'email', 'manual')),
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Review verifications table
CREATE TABLE review_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('linkedin', 'email', 'manual')),
  verification_token TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  verifier_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Review helpful votes table
CREATE TABLE review_helpful_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'team', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Benchmark reports table (Phase 1: lead magnet)
CREATE TABLE benchmark_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  year INTEGER NOT NULL,
  is_gated BOOLEAN DEFAULT TRUE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report downloads table
CREATE TABLE report_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES benchmark_reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event comparisons table (Pro/Team feature)
CREATE TABLE event_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  event_ids UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Events indexes
CREATE INDEX idx_events_name ON events(name);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_location ON events(location);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_is_featured ON events(is_featured);

-- Event metrics indexes
CREATE INDEX idx_event_metrics_event_id ON event_metrics(event_id);
CREATE INDEX idx_event_metrics_year ON event_metrics(year);

-- Reviews indexes
CREATE INDEX idx_reviews_event_id ON reviews(event_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_published_at ON reviews(published_at) WHERE status = 'published';
CREATE INDEX idx_reviews_is_verified ON reviews(is_verified);

-- Review helpful votes indexes
CREATE INDEX idx_review_helpful_votes_review_id ON review_helpful_votes(review_id);
CREATE INDEX idx_review_helpful_votes_user_id ON review_helpful_votes(user_id);

-- Subscriptions indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_tier ON subscriptions(tier);

-- Profiles indexes
CREATE INDEX idx_profiles_company_id ON profiles(company_id);
CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);

-- Companies indexes
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_industry ON companies(industry);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate average ROI for an event
CREATE OR REPLACE FUNCTION calculate_event_avg_roi(event_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
BEGIN
  RETURN (
    SELECT AVG(roi)
    FROM reviews
    WHERE event_id = event_uuid
      AND status = 'published'
      AND roi IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql;

-- Function to update helpful_count on review_helpful_votes changes
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reviews
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.review_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reviews
    SET helpful_count = GREATEST(0, helpful_count - 1)
    WHERE id = OLD.review_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to check subscription review limit
CREATE OR REPLACE FUNCTION check_review_limit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_tier TEXT;
  current_month_reviews INTEGER;
  tier_limit INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM profiles
  WHERE id = user_uuid;

  -- Get current month's review count
  SELECT COUNT(*) INTO current_month_reviews
  FROM reviews
  WHERE user_id = user_uuid
    AND created_at >= date_trunc('month', NOW());

  -- Set limits based on tier
  CASE user_tier
    WHEN 'free' THEN tier_limit := 3;
    WHEN 'pro' THEN tier_limit := 999999; -- Unlimited
    WHEN 'team' THEN tier_limit := 999999; -- Unlimited
    WHEN 'enterprise' THEN tier_limit := 999999; -- Unlimited
    ELSE tier_limit := 0;
  END CASE;

  RETURN current_month_reviews < tier_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to update event metrics avg_roi when review is published
CREATE OR REPLACE FUNCTION update_event_metrics_roi()
RETURNS TRIGGER AS $$
DECLARE
  event_year INTEGER;
  calculated_roi DECIMAL(5,2);
BEGIN
  -- Only update when review is published and has ROI
  IF NEW.status = 'published' AND NEW.roi IS NOT NULL THEN
    -- Get event year from start_date
    SELECT EXTRACT(YEAR FROM start_date)::INTEGER INTO event_year
    FROM events
    WHERE id = NEW.event_id;

    -- Calculate average ROI for this event and year
    SELECT AVG(roi) INTO calculated_roi
    FROM reviews
    WHERE event_id = NEW.event_id
      AND status = 'published'
      AND roi IS NOT NULL;

    -- Update or insert event_metrics
    INSERT INTO event_metrics (event_id, year, avg_roi, source)
    VALUES (NEW.event_id, event_year, calculated_roi, 'review_aggregate')
    ON CONFLICT (event_id, year)
    DO UPDATE SET
      avg_roi = calculated_roi,
      source = 'review_aggregate',
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at for all tables
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_metrics_updated_at
  BEFORE UPDATE ON event_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_benchmark_reports_updated_at
  BEFORE UPDATE ON benchmark_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_comparisons_updated_at
  BEFORE UPDATE ON event_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update helpful_count when votes change
CREATE TRIGGER update_helpful_count_on_insert
  AFTER INSERT ON review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

CREATE TRIGGER update_helpful_count_on_delete
  AFTER DELETE ON review_helpful_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Update event metrics ROI when review is published
CREATE TRIGGER update_event_metrics_on_review_publish
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  WHEN (NEW.status = 'published' AND NEW.roi IS NOT NULL)
  EXECUTE FUNCTION update_event_metrics_roi();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmark_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_comparisons ENABLE ROW LEVEL SECURITY;

-- Companies: Public read, authenticated write
CREATE POLICY "Companies are viewable by everyone"
  ON companies FOR SELECT
  USING (true);

CREATE POLICY "Users can insert companies"
  ON companies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own company"
  ON companies FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Profiles: Users can read all, update own
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Events: Public read, authenticated write
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update events"
  ON events FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Event metrics: Public read, authenticated write
CREATE POLICY "Event metrics are viewable by everyone"
  ON event_metrics FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert event metrics"
  ON event_metrics FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update event metrics"
  ON event_metrics FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Reviews: Public read published, users can manage own
CREATE POLICY "Published reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Review verifications: Users can read own, authenticated write
CREATE POLICY "Users can view verifications for their reviews"
  ON review_verifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reviews
      WHERE reviews.id = review_verifications.review_id
      AND reviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can insert verifications"
  ON review_verifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Review helpful votes: Public read, authenticated write
CREATE POLICY "Helpful votes are viewable by everyone"
  ON review_helpful_votes FOR SELECT
  USING (true);

CREATE POLICY "Users can vote on reviews"
  ON review_helpful_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own votes"
  ON review_helpful_votes FOR DELETE
  USING (auth.uid() = user_id);

-- Subscriptions: Users can read own
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Benchmark reports: Public read, authenticated write
CREATE POLICY "Benchmark reports are viewable by everyone"
  ON benchmark_reports FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert reports"
  ON benchmark_reports FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update reports"
  ON benchmark_reports FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Report downloads: Users can read own, authenticated write
CREATE POLICY "Users can view their own downloads"
  ON report_downloads FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'authenticated');

CREATE POLICY "Users can track their own downloads"
  ON report_downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');

-- Event comparisons: Users can manage own
CREATE POLICY "Users can view their own comparisons"
  ON event_comparisons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comparisons"
  ON event_comparisons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comparisons"
  ON event_comparisons FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparisons"
  ON event_comparisons FOR DELETE
  USING (auth.uid() = user_id);
