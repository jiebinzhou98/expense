// app/categories/page.tsx  (SERVER)
import { requireUser } from '@/lib/auth/requireUser'
import Client from './Client'

export default async function Page() {
  await requireUser('/categories')
  return <Client />
}
