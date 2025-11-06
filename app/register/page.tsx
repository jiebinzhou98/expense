// src/app/(auth)/register/page.tsx
'use client'

import dynamic from 'next/dynamic'
const AuthForm = dynamic(() => import('@/components/AuthForm'), { ssr: false })

export default function RegisterPage() {
  return (
    <main className="p-6 flex justify-center">
      <AuthForm mode="register" />
    </main>
  )
}
