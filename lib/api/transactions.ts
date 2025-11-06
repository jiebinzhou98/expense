import { supabase } from "../supabase/client";

export type Tx = {
  id: string;
  account_id: string;
  category_id: string | null;
  amount: number;
  note: string | null;
  occurred_at: string;
  created_at: string;
}

export async function fetchTransactions(params?: {
  account_id?: string;
  from?: string;
  to?: string;
}){
  let q = supabase
    .from('transactions')
    .select('id, account_id, category_id, amount, note, occurred_at')
    .order('occurred_at', {ascending: false})

  if(params?.account_id) q = q.eq('account_id', params.account_id)
  if(params?.from) q = q.gte('occurred_at', params.from)
  if(params?.to) q = q.lte('occurred_at', params.to)

  const {data, error} = await q
  if(error) throw new Error (error.message)
  return data as Tx[]
}

export async function createTransaction(payload: Omit<Tx, 'id' | 'created_at'>) {
  const {data, error} = await supabase
    .from('transactions')
    .insert(payload)
    .select('id, account_id, category_id, amount, note, occurred_at, created_at')
    .single()
  if(error) throw new Error(error.message)
  return data as Tx
}

export async function deleteTransaction(id: string) {
  const {error} = await supabase.from('transactions').delete()
  .eq('id', id)
  if(error) throw new Error(error.message)

}