import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServerClient()
    supabase.schema('expense')

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userData.user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('/api/accounts/[id] DELETE error', e)
    return NextResponse.json({ error: e?.message ?? 'Server error' }, { status: 500 })
  }
}
