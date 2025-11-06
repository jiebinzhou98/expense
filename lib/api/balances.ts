import { supabase } from "../supabase/client";

export async function fetchAccountBalances() {
  const {data, error} = await supabase
    .from('account_balances')
    .select('account_id, user_id, name, currency, balance')
    .order('name')

  if(error) throw new Error(error.message)
  return data as { account_id: string; user_id: string; name: string; currency: string; balance: number} []

}