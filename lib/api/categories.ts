import { supabase } from "../supabase/client";

export type CategoryType = 'income' | 'expense'
export type Category = {id: string; name: string; type: CategoryType; created_at: string}

export async function fetchCategories(type?: CategoryType): Promise<Category[]>{
  let q = supabase.from('categories').select('id, name, type, created_at').order('name')
  if(type) q = q.eq('type', type)
  const {data, error} = await q
  if(error) throw new Error(error.message)
  return data ?? []
}

export async function createCategory(payload: {name: string; type: CategoryType}){
  const {data, error} = await supabase
    .from('categories')
    .insert(payload)
    .select('id, name, type, created_at')
    .single()
  if(error) throw new Error(error.message)
  return data as Category
}

export async function deleteCategory(id: string) {
  const {error} = await supabase.from('categoreies').delete().eq('id', id)
  if(error) throw new Error(error.message)
}