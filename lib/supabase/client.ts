// lib/supabase/client.ts
'use client'

import { createBrowserClient } from '@supabase/ssr'

// export a singleton so HMR doesn't create multiple clients
let _client: ReturnType<typeof createBrowserClient> | null = null

export const supabase = (() => {
  if (_client) return _client
  _client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  return _client
})()
