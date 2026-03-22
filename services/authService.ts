import { supabase } from "@/lib/supabase"

export async function getCurrentUser() {
  const { data: userData, error } = await supabase.auth.getUser()
  if (error) {
    return { user: null, error }
  }
  return { user: userData.user, error: null }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}

export async function signInWithGoogle(redirectTo: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo }
  })
  return { data, error }
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { data, error }
}
