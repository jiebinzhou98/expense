// SERVER component
import { requireUser } from '@/lib/auth/requireUser'
import Client from './Client'

export default async function Page() {
  await requireUser('/transactions')
  return <Client />
}
