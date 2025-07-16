import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const { email, password, isGuest } = await request.json();
  
  if (isGuest) {
    // Guest login: try to sign in, if fails, create user without email verification
    const { data: signInData, error: signInError } = await locals.supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (signInError && signInError.message.includes('Invalid login credentials')) {
      // Try to sign up instead
      const { data: signupData, error: signupError } = await locals.supabase.auth.signUp({ 
        email, 
        password,
        options: { 
          emailRedirectTo: null,
          data: { is_guest: true }
        } 
      });
      
      if (signupError) {
        return json({ error: signupError.message }, { status: 400 });
      }
      return json({ user: signupData.user });
    }
    
    if (signInError) {
      return json({ error: signInError.message }, { status: 400 });
    }
    return json({ user: signInData.user });
  }
  
  // Standard login
  const { data, error } = await locals.supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return json({ error: error.message }, { status: 400 });
  }
  return json({ user: data.user });
}; 