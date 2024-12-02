import { supabase } from '../lib/supabase';

async function setAdminRole() {
  const email = 'leila.s.sousa@hotmail.com';
  
  try {
    console.log('Setting admin role for:', email);
    
    // First sign in to get the user ID
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: 'the_fire_pit@2024'
    });

    if (signInError) {
      console.error('Error signing in:', signInError);
      return;
    }

    if (!user) {
      console.error('User not found. Please sign up first at http://localhost:3001/signup');
      return;
    }

    // Create or update profile with admin role
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        role: 'admin',
        updated_at: new Date().toISOString()
      });

    if (upsertError) {
      console.error('Error updating profile:', upsertError);
      return;
    }

    console.log('Successfully set admin role for:', email);
    console.log('You can now access the admin dashboard at http://localhost:3001/admin');
  } catch (error) {
    console.error('Error:', error);
    console.log('Please make sure to:');
    console.log('1. Sign up first at http://localhost:3001/signup');
    console.log('2. Verify your email if required');
    console.log('3. Try logging in at http://localhost:3001/login');
  }
}

// Execute immediately
setAdminRole(); 