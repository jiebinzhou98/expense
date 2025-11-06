'use client'

import {useEffect, useState, useMemo} from 'react'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { fetchTransactions, createTransaction, deleteTransaction } from '@/lib/api/transactions'
import { fetchAccounts } from '@/lib/api/accounts'
import { CategoryType, fetchCategories } from '@/lib/api/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

type CreateTxForm = {
  account_id: string
  category_id: string
  amount: string
  type: CategoryType
  note: string
  date: string
}

export default function TransactionsPage() {
  const qc = useQueryClient()

  //filter
  const [accountFilter, setAccountFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<CategoryType | 'all'>('all')

  //form state
  const [form, setForm] = useState<CreateTxForm>({
    account_id: '',
    category_id: '',
    amount: '',
    type: 'expense',
    note: '',
    date: new Date().toISOString().slice(0, 10),
  })

  //queries
  const {data: accounts} = useQuery({queryKey: ['accounts'], queryFn: fetchAccounts})
  const {data: categories} = useQuery({queryKey: ['categories'], queryFn: () => fetchCategories()})
  const {data: txs, isLoading, error} = useQuery({
    queryKey: ['transactions', {account_id: accountFilter}],
    queryFn: () => fetchTransactions({account_id: accountFilter || undefined})
  })

  useEffect(() => {
    if(!form.account_id && accounts?.length){
      setForm((f) => ({...f, account_id: accounts[0].id}))
    }
  },[accounts])

  const expenseCats = useMemo(() => (categories ?? []).filter(c => c.type === 'expense'), [categories])
  const incomeCats = useMemo(() => (categories ?? []).filter(c => c.type === 'income'), [categories])
  const visibleTxs = useMemo(() => {
    if(!txs) return []
    if(typeFilter === 'all') return txs

    return txs.filter(t => (typeFilter === 'income' ? Number(t.amount) > 0: Number(t.amount) < 0))
  }, [txs, typeFilter])

  const createMut = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success('Transaction added')
      qc.invalidateQueries({queryKey: ['transactions']})
      qc.invalidateQueries({queryKey: ['account_balances']})
      setForm((f) => ({...f, amount: '', note: ''}))
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to add'),
  })

  const deleteMut = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () =>{
      toast.success('Delete')
      qc.invalidateQueries({queryKey: ['transactions']})
      qc.invalidateQueries({queryKey: ['account_balances']})
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to delete'),
  })

  const submit = () =>{
    if(!form.account_id) return toast.error('Pick an account')
    if(!form.amount.trim()) return toast.error('Enter amount')

    const raw = Number(form.amount)
    if(Number.isNaN(raw)) return toast.error('Amount must be a number')

    const amount = form.type === 'expense' ? -Math.abs(raw) : Math.abs(raw)

    createMut.mutate({
      account_id: form.account_id,
      category_id: form.category_id,
      amount,
      note: form.note || null,
      occurred_at: new Date(form.date + 'T00:00:00').toISOString(),
    })
  }

  return(
    <main className='px-6 py-8 space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Transactions</h1>
      </div>

      <Card className='p-4 space-y-4'>
        <div className='grid md:grid-cols-6 gap-3'>
          <div className='space-y-2 md:col-span-2'>
            <Label>Account</Label>
            <select 
              className='h-9 w-full rounded-md border px-3'
              value={form.account_id}
              onChange={(e) => setForm((f) => ({...f, account_id: e.target.value}))}
            >
              <option value="" disabled>Select Account</option>
            </select>
          </div>

          <div className='space-y-2'>
            <Label>Type</Label>
            <select
              className='h-9 w-full rounded-md border px-3'
              value={form.type}
              onChange={(e) => setForm((f) => ({...f, type: e.target.value as any, category_id: ""}))}
            >
              <option value="expense">Expense (-)</option>
              <option value="income">Income (+)</option>
            </select>
          </div>

          <div className='space-y-2'>
            <Label>Category</Label>
            <select
              className='h-9 w-full rounded-md border px-3'
              value={form.category_id ?? ''}
              onChange={(e) => setForm((f) => ({...f, category_id: e.target.value || ""}))}
            >
              <option value="">(Optional)</option>
              {
                (form.type === 'expense' ? expenseCats : incomeCats).map(c => (
                  <option value={c.id} key={c.id}>{c.name}</option>
                ))
              }
            </select>
          </div>

          <div className='space-y-2'>
            <Label>Amount</Label>
            <Input
              value={form.amount}
              onChange={(e) => setForm((f) => ({...f, amount: e.target.value}))}
              placeholder='e.g  12.50'
              inputMode='decimal'
            />
          </div>

          <div className='space-y-2'>
            <Label>Date</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({...f, date: e.target.value}))}
            />
          </div>
        </div>

        <div className='grid md:grid-cols-6 gap-3'>
          <div className='space-y-2 md:col-span-5'>
            <Label>Note</Label>
            <Input
              value={form.note}
              onChange={(e) => setForm((f) => ({...f, note:e.target.value}))}
              placeholder='(Optional)'
              />
          </div>
          <div className='flex items-end'>
            <Button onClick={submit} disabled={createMut.isPending} className='w-full'>
              Add
            </Button>
          </div>
        </div>
      </Card>

      <Separator/>

      <div className='flex gap-3 items-end'>
        <div className='space-y-2'>
          <Label>Filter By Account</Label>
          <select
            className='h-9 rounded-md border px-3'
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
          >
            <option value="">All</option>
            {(accounts ?? []).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        
        <div className='space-y-2'>
          <Label>Type</Label>
          <select
            className='h-9 rounded-md border px-3'
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && 
      (<p className='text-red-600 border border-red-200 bg-red-50 p-3 rounded'>{(error as Error).message}</p>)}

      <div className='grid gap-3'>
        {visibleTxs.map(t => (
          <Card 
            key={t.id} 
            className='p-4 flex items-center justify-between'
          >
            <div>
              <div className='font-medium'>
                {Number(t.amount).toFixed(2)} {Number(t.amount) >= 0 ?'🟢' : '🔴'}
              </div>
              <div className='text-sm text-muted-foreground'>
                {new Date(t.occurred_at).toLocaleDateString()} · {t.note ?? '—'}
              </div>
            </div>
            <Button variant="destructive" onClick={() => deleteMut.mutate(t.id)}>
              Delete
            </Button>
          </Card>
        ))}
        {visibleTxs.length === 0 && !isLoading && !error && (
          <p className='text-sm text-muted-foreground'>No transactions yet</p>
        )}
      </div>
    </main>
  )
}



