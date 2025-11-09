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

  const { data: accounts, isLoading, error } = useQuery({ queryKey: ['accounts'], queryFn: fetchAccounts })
  const { data: balances } = useQuery({ queryKey: ['account_balances'], queryFn: fetchAccountBalances })

  const balanceMap = useMemo(
    () => Object.fromEntries((balances ?? []).map(b => [b.account_id, b])),
    [balances]
  )

  const total = useMemo(
    () => (balances ?? []).reduce((s, b) => s + Number(b.balance || 0), 0),
    [balances]
  )

  const createMut = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      toast.success('Account created')
      setOpen(false)
      setName('')
      setCurrency('CAD')
      qc.invalidateQueries({ queryKey: ['accounts'] })
      qc.invalidateQueries({ queryKey: ['account_balances'] })
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to create'),
  })

  const deleteMut = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success('Account deleted')
      qc.invalidateQueries({ queryKey: ['accounts'] })
      qc.invalidateQueries({ queryKey: ['account_balances'] })
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to delete'),
  })

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
          <p className="text-sm text-slate-500">
            Total balance:&nbsp;
            <span className="font-semibold">{fmtMoney(total)}</span>
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-lg">Add Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Account</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Chequing"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
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

              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setOpen(false)} className="rounded-lg">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!name.trim()) return toast.error('Please enter a name')
                    createMut.mutate({ name: name.trim(), currency })
                  }}
                  disabled={createMut.isPending}
                  className="rounded-lg"
                >
                  {createMut.isPending ? 'Creating…' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* States */}
      {isLoading && <p className="text-sm text-slate-500">Loading accounts…</p>}
      {error && (
        <p className="text-red-600 border border-red-200 bg-red-50 p-3 rounded">
          {(error as Error).message}
        </p>
      )}

      {/* Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {(accounts ?? []).map((a) => (
          <Card
            key={a.id}
            className="p-4 rounded-xl border-slate-200 shadow-sm flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{a.name}</div>
              <div className="text-sm text-slate-500">{a.currency}</div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold">
                {fmtMoney(Number(balanceMap[a.id]?.balance ?? 0), a.currency)}
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="mt-2 rounded-lg"
                onClick={() => deleteMut.mutate(a.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}

        {(accounts ?? []).length === 0 && !isLoading && !error && (
          <Card className="p-8 rounded-xl border-dashed border-2 text-center text-slate-500">
            No accounts yet. Click <span className="font-medium">Add Account</span> to get started.
          </Card>
        )}
      </div>
    </main>
  )
}
