// lib/auth/requireUser.ts
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function requireUser(redirectTo: string) {
  const sb = await createSupabaseServerClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`)
  }
  return { sb, user }
}
