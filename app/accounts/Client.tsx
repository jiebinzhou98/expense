// app/accounts/page.tsx
'use client'

import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAccounts, createAccount, deleteAccount, type Account } from '@/lib/api/accounts'

import { fetchAccountBalances } from '@/lib/api/balances'
import { fmtMoney } from '@/lib/format'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

const CURRENCIES: Account['currency'][] = ['CAD', 'USD', 'EUR', 'GBP', 'JPY']


export default function AccountsPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState<Account['currency']>('CAD')

  const { data, isLoading, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  })

  const {data: balances} = useQuery({
    queryKey: ['account_balances'],
    queryFn: fetchAccountBalances,
  })

  const balanceMap = useMemo(
    () => Object.fromEntries((balances ?? []).map(b => [b.account_id, b])),[balances]
  )

  const createMut = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      toast.success('Account created')
      setOpen(false)
      setName('')
      setCurrency('CAD')
      qc.invalidateQueries({ queryKey: ['accounts'] }) // ✅ refetch list
      qc.invalidateQueries({queryKey: ['account_balances']})
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to create'),
  })

  const deleteMut = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success('Account deleted')
      qc.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to delete'),
  })

  return (
    <main className="px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Accounts</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Account</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  className="w-full border rounded-md h-9 px-3"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Account['currency'])}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <Button
                onClick={() => {
                  if (!name.trim()) {
                    toast.error('Please enter a name')
                    return
                  }
                  createMut.mutate({ name: name.trim(), currency })
                }}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="my-4" />

      {isLoading && <p>Loading…</p>}

      {error && (
        <p className="text-red-600 border border-red-200 bg-red-50 p-3 rounded">
          {(error as Error).message}
        </p>
      )}

      <div className="grid gap-3">
        {data?.map((a) => (
          <Card key={a.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{a.name}</div>
              <div className="text-sm text-muted-foreground">{a.currency}</div>
            </div>

            {/* 👉 Add this right side */}
            <div className="text-right">
              <div className="text-lg font-semibold">
                {fmtMoney(Number(balanceMap[a.id]?.balance ?? 0), a.currency)}
              </div>
              <Button
                variant="destructive"
                className="mt-2"
                onClick={() => deleteMut.mutate(a.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
        {data?.length === 0 && !isLoading && !error && (
          <p className="text-sm text-muted-foreground">No accounts yet. Create one to get started.</p>
        )}
      </div>
    </main>
  )
}
