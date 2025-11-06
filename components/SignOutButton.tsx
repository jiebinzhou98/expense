'use client'

import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function SignOutButton() {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error(error)
      return
    }
    // refresh UI after sign out
    location.reload()
  }

  return (
    <Button className="rounded border px-3 py-2" onClick={handleSignOut}>
      Sign Out
    </Button>
  )
}
