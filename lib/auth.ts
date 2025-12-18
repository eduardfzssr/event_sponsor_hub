import { createClient } from './supabase/client'

export interface UserData {
  userId: string
  email: string
  fullName: string | null
  role: string | null
  companyId: string | null
  subscriptionTier: string
  subscriptionStatus: string
}

/**
 * Get the current authenticated user with their profile
 */
export async function getCurrentUser(): Promise<UserData | null> {
  if (typeof window === 'undefined') return null

  try {
    const supabase = createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.user) {
      return null
    }

    // Get user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      console.error('Error getting user profile:', profileError)
      // Return basic user data if profile doesn't exist
      return {
        userId: session.user.id,
        email: session.user.email || '',
        fullName: null,
        role: null,
        companyId: null,
        subscriptionTier: 'free',
        subscriptionStatus: 'active',
      }
    }

    return {
      userId: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      role: profile.role,
      companyId: profile.company_id,
      subscriptionTier: profile.subscription_tier || 'free',
      subscriptionStatus: profile.subscription_status || 'active',
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<{ error: string | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Return user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Invalid email or password' }
      }
      if (error.message.includes('Email not confirmed')) {
        return { error: 'Please verify your email address before signing in' }
      }
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    console.error('Error signing in:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

/**
 * Sign up a new user with email and password
 * Creates both auth user and profile record
 */
export async function signUp(
  email: string,
  password: string,
  fullName?: string
): Promise<{ error: string | null }> {
  try {
    const supabase = createClient()
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      // Return user-friendly error messages
      if (authError.message.includes('User already registered')) {
        return { error: 'An account with this email already exists' }
      }
      if (authError.message.includes('Password')) {
        return { error: 'Password must be at least 6 characters' }
      }
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Failed to create user account' }
    }

    // Profile is automatically created by database trigger (handle_new_user)
    // If full_name is provided, update the profile with it
    // Use upsert to handle both cases (profile exists or not)
    if (fullName) {
      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: authData.user.email || email,
          full_name: fullName,
        }, {
          onConflict: 'id',
        })

      if (profileError) {
        console.error('Error updating profile with full name:', profileError)
        // Don't fail signup if profile update fails - profile was created by trigger
      }
    }

    return { error: null }
  } catch (error) {
    console.error('Error signing up:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    console.error('Error signing out:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}
