'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAccountBalances } from '@/lib/api/balances'
import { fetchTransactions } from '@/lib/api/transactions'
import { fmtMoney } from '@/lib/format'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import MonthlyNetChart from '@/components/MonthlyNetChart'
import MonthlyExpenseByCategory from '@/components/MonthlyExpenseByCategory'

export default function Dashboard() {
  const { data: balances } = useQuery({ queryKey: ['account_balances'], queryFn: fetchAccountBalances })
  const { data: txs } = useQuery({ queryKey: ['transactions', { scope: 'dashboard' }], queryFn: () => fetchTransactions() })

  const month = new Date()
  const monthStartIso = new Date(month.getFullYear(), month.getMonth(), 1).toISOString()
  const monthEndIso = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const { income, expense, net } = useMemo(() => {
    const inRange = (txs ?? []).filter(t => t.occurred_at >= monthStartIso && t.occurred_at <= monthEndIso)
    const inc = inRange.filter(t => Number(t.amount) > 0).reduce((s, t) => s + Number(t.amount), 0)
    const exp = inRange.filter(t => Number(t.amount) < 0).reduce((s, t) => s + Number(t.amount), 0)
    return { income: inc, expense: Math.abs(exp), net: inc + exp }
  }, [txs, monthStartIso, monthEndIso])

  return (
    <main className="px-6 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">This month income</div>
          <div className="text-2xl font-semibold">{fmtMoney(income)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">This month expense</div>
          <div className="text-2xl font-semibold">{fmtMoney(-expense)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">This month net</div>
          <div className={`text-2xl font-semibold ${net >= 0 ? '' : 'text-red-600'}`}>
            {fmtMoney(net)} 
          </div>
        </Card>
      </div>

      <h2 className='text-xl font-semibold mt-8'>This month (Daily Net)</h2>
      <MonthlyExpenseByCategory/>

      <Separator className='my-6'/>

      <h2 className="text-xl font-semibold">Account Balances</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {(balances ?? []).map(b => (
          <Card key={b.account_id} className="p-4">
            <div className="font-medium">{b.name}</div>
            <div className="text-sm text-muted-foreground">{b.currency}</div>
            <div className="mt-2 text-xl font-semibold">
              {fmtMoney(Number(b.balance), b.currency)}
            </div>
          </Card>
        ))}
        {(balances ?? []).length === 0 && <p className="text-sm text-muted-foreground">No accounts yet.</p>}
      </div>
    </main>
  )
}
