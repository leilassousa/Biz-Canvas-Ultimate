import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    debug: true
  }
});

// Add this for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
});

// Log initialization
console.log('Supabase client initialized');

// Add error handling wrapper
export const getProfile = async (userId: string) => {
  try {
    console.log('Fetching profile for user:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    console.log('Profile fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in getProfile:', error);
    throw error;
  }
}; 