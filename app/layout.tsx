import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import TopNav from '@/components/TopNav'
import AuthStateListener from '@/components/AuthStateListener'

export const metadata: Metadata = { title: 'Expense Tracker', description: 'Track expenses fast.' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <AuthStateListener/>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
