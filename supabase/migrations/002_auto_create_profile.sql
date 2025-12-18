-- ============================================
-- AUTO-CREATE PROFILE TRIGGER
-- ============================================
-- This trigger automatically creates a profile record
-- when a new user signs up in auth.users
-- This bypasses RLS issues during signup

-- Function to handle automatic profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_tier, subscription_status)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users to create profile automatically
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
