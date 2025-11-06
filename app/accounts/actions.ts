'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type Result<T> = { ok: true; data: T } | { ok: false; error: string }

export async function getAccounts(): Promise<Result<
  { id: string; name: string; currency: string; created_at: string }[]
>> {
  try {
    const sb = await createSupabaseServerClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return { ok: true, data: [] }

    // bind to expense schema
    const db = sb.schema('expense')
    const { data, error } = await db
      .from('accounts')
      .select('id,name,currency,created_at')
      .order('created_at', { ascending: false })

    if (error) return { ok: false, error: error.message }
    return { ok: true, data: data ?? [] }
  } catch (e: any) {
    console.error('getAccounts error:', e)
    return { ok: false, error: e?.message ?? 'Unknown error' }
  }
}

export async function createAccountAction(formData: FormData): Promise<Result<null>> {
  try {
    const name = String(formData.get('name') ?? '').trim()
    const currency = String(formData.get('currency') ?? 'CAD').slice(0,3).toUpperCase()
    if (!name) return { ok: false, error: 'Name required' }

    const sb = await createSupabaseServerClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return { ok: false, error: 'Unauthorized' }

    const db = sb.schema('expense')
    const { error } = await db.from('accounts').insert([{ name, currency, user_id: user.id }])
    if (error) return { ok: false, error: error.message }

    revalidatePath('/accounts')
    return { ok: true, data: null }
  } catch (e: any) {
    console.error('createAccountAction error:', e)
    return { ok: false, error: e?.message ?? 'Unknown error' }
  }
}

export async function deleteAccountAction(id: string): Promise<Result<null>> {
  try {
    const sb = await createSupabaseServerClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return { ok: false, error: 'Unauthorized' }

    const db = sb.schema('expense')
    const { error } = await db
      .from('accounts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return { ok: false, error: error.message }

    revalidatePath('/accounts')
    return { ok: true, data: null }
  } catch (e: any) {
    console.error('deleteAccountAction error:', e)
    return { ok: false, error: e?.message ?? 'Unknown error' }
  }
}
