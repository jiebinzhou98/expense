'use client'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {useState, type ReactNode} from 'react'
import {Toaster} from 'sonner'

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster richColors closeButton />
    </QueryClientProvider>
  )
}