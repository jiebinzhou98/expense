'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { supabase } from '@/lib/supabase/client'
import { authSchema, type AuthValues } from '@/lib/validators'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'

export default function AuthForm({ mode }: { mode: 'register' | 'login' }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const form = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: AuthValues) => {
    try {
      setBusy(true)

      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        })
        if (error) throw error
        toast.success('Check your email to confirm your account.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        })
        if (error) throw error
        toast.success('Logged in')
        router.push('/accounts')
      }
    } catch (e: any) {
      toast.error(e.message ?? 'Auth failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="p-6 max-w-sm w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input type="password" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={busy} className="w-full">
            {mode === 'register' ? 'Create account' : 'Sign in'}
          </Button>
        </form>
      </Form>
    </Card>
  )
}
