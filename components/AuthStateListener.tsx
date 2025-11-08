'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthStateListener() {
  const router = useRouter()

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // give the client a tick to write cookies, then refresh the RSC tree
        setTimeout(() => router.refresh(), 0)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [router])

  return null
}
