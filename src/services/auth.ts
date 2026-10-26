import { supabase } from '@/lib/supabase';
import type { SignInInput, SignUpInput } from '@/schemas/auth';

export async function signIn(input: SignInInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  });

  if (error) throw error;

  return data;
}

export async function signUp(input: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      data: { name: input.name.trim() },
    },
  });

  if (error) throw error;

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  return data.session?.user ?? null;
}
