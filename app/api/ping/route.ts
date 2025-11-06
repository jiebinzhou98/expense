import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  supabase.schema('expense')

  const { error } = await supabase
    .from('accounts')
    .select('*', { head: true, count: 'exact' })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
