'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function SignOutButton({
  children,
}: {
  children?: React.ReactNode
}) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Signed out')
      router.push('/login')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      toast.error('Sign out failed')
    }
  }

  return (
    <Button
      onClick={handleSignOut}
      variant="secondary"
      className="hover:bg-gray-200 transition-colors"
    >
      {children ?? 'Sign Out'}
    </Button>
  )
}
