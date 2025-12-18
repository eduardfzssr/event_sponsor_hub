-- ============================================
-- USER EVENT STATUSES TABLE
-- ============================================
-- This table tracks user interactions with events
-- Statuses: want_to_go, going, went, rated, not_interested

CREATE TABLE user_event_statuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('want_to_go', 'going', 'went', 'rated', 'not_interested')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Indexes for performance
CREATE INDEX idx_user_event_statuses_user_id ON user_event_statuses(user_id);
CREATE INDEX idx_user_event_statuses_event_id ON user_event_statuses(event_id);
CREATE INDEX idx_user_event_statuses_status ON user_event_statuses(status);
CREATE INDEX idx_user_event_statuses_user_status ON user_event_statuses(user_id, status);

-- Update updated_at trigger
CREATE TRIGGER update_user_event_statuses_updated_at
  BEFORE UPDATE ON user_event_statuses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE user_event_statuses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own statuses
CREATE POLICY "Users can view their own event statuses"
  ON user_event_statuses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own statuses
CREATE POLICY "Users can insert their own event statuses"
  ON user_event_statuses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own statuses
CREATE POLICY "Users can update their own event statuses"
  ON user_event_statuses FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own statuses
CREATE POLICY "Users can delete their own event statuses"
  ON user_event_statuses FOR DELETE
  USING (auth.uid() = user_id);
