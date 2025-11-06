// lib/api/accounts.ts
import { supabase } from '@/lib/supabase/client'

export type Account = {
  id: string
  name: string
  currency: 'CAD' | 'USD' | 'EUR' | 'GBP' | 'JPY'
  created_at: string
}

export async function fetchAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('id, name, currency, created_at')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createAccount(payload: { name: string; currency: Account['currency'] }) {
  const { data, error } = await supabase
    .from('accounts')
    .insert(payload)
    .select('id, name, currency, created_at')
    .single()

  if (error) throw new Error(error.message)
  return data as Account
}

export async function deleteAccount(id: string) {
  const { error } = await supabase.from('accounts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
