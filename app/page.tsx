// app/page.tsx
'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { fetchAccountBalances } from '@/lib/api/balances'
import { fetchTransactions } from '@/lib/api/transactions'
import { fmtMoney } from '@/lib/format'

import Section from '@/components/Section'
import StatCard from '@/components/StatCard'
import MonthlyExpenseByCategory from '@/components/MonthlyExpenseByCategory'
import { Card } from '@/components/ui/card'

export default function Dashboard() {
  // live balances for the grid at the bottom
  const { data: balances } = useQuery({
    queryKey: ['account_balances'],
    queryFn: fetchAccountBalances,
  })

  // all transactions; we’ll compute this month’s stats client-side
  const { data: txs } = useQuery({
    queryKey: ['transactions', { scope: 'dashboard' }],
    queryFn: () => fetchTransactions(),
  })

  // month range
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  // income / expense / net for this month
  const { income, expense, net } = useMemo(() => {
    const inRange = (txs ?? []).filter(t => {
      const ts = new Date(t.occurred_at).getTime()
      return ts >= monthStart.getTime() && ts <= monthEnd.getTime()
    })

    const inc = inRange
      .filter(t => Number(t.amount) > 0)
      .reduce((s, t) => s + Number(t.amount), 0)

    const exp = inRange
      .filter(t => Number(t.amount) < 0)
      .reduce((s, t) => s + Number(t.amount), 0)

    return { income: inc, expense: Math.abs(exp), net: inc + exp }
  }, [txs, monthStart, monthEnd])

  return (
    <div className="space-y-10">
      {/* Top stats */}
      <Section title="Dashboard" desc="Quick snapshot of this month">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="This month income"  value={fmtMoney(income)} />
          <StatCard label="This month expense" value={fmtMoney(-expense)} accent="bad" />
          <StatCard label="This month net"     value={fmtMoney(net)} accent={net >= 0 ? 'good' : 'bad'} />
        </div>
      </Section>

      {/* Composition (pie) */}
      <Section title="This Month (expense by category)">
        <Card className="p-4 rounded-xl border-slate-200 shadow-sm">
          <MonthlyExpenseByCategory />
        </Card>
      </Section>

      {/* Balances */}
      <Section title="Account Balances" desc="Live balances from your accounts">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(balances ?? []).map(b => (
            <Card key={b.account_id} className="p-4 rounded-xl border-slate-200 shadow-sm">
              <div className="font-medium">{b.name}</div>
              <div className="text-sm text-slate-500">{b.currency}</div>
              <div className="mt-2 text-xl font-semibold">
                {fmtMoney(Number(b.balance), b.currency)}
              </div>
            </Card>
          ))}
          {(balances ?? []).length === 0 && (
            <p className="text-sm text-slate-500">No accounts yet.</p>
          )}
        </div>
      </Section>
    </div>
  )
}
