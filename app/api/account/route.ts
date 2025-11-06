import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    supabase.schema('expense')

    const { data: userData, error: uErr } = await supabase.auth.getUser()
    if (uErr || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('accounts')
      .select('id,name,currency,created_at')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ accounts: data ?? [] })
  } catch (e: any) {
    console.error('/api/accounts GET error', e)
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    supabase.schema('expense')

    const { data: userData, error: uErr } = await supabase.auth.getUser()
    if (uErr || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const name = String(body?.name ?? '').trim()
    const currency = String(body?.currency ?? 'CAD').slice(0, 3).toUpperCase()
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

    const { error } = await supabase.from('accounts').insert([
      { name, currency, user_id: userData.user.id },
    ])

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('/api/accounts POST error', e)
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 })
  }
}
