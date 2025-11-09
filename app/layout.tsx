import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import TopNav from '@/components/TopNav'
import AuthStateListener from '@/components/AuthStateListener'

export const metadata: Metadata = { title: 'Expense Tracker', description: 'Track expenses fast.' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='bg-linear-to-br from-slate-50 to-slate-100 text-slate-900 antialiased min-h-screen flex flex-col'>
        <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm'>
          <TopNav />
        </header>

        <AuthStateListener/>

        <main className='flex-1 w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8'>
          <Providers>{children}</Providers>
        </main>

        <footer className='border-t border-slate-200 bg-white/70 backdrop-blur-sm py-4 text-center text-sm text-slate-500'>
          <p>© {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
