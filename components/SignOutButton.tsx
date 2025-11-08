'use client'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function SignOutButton() {
  const router = useRouter()
  const onClick = async () => {
    await supabase.auth.signOut()
    router.replace('/')
    router.refresh()
  }
  return <Button onClick={onClick}>Sign Out</Button>
}
