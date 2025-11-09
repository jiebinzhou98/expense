'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTransactions } from '@/lib/api/transactions'
import { fetchCategories } from '@/lib/api/categories'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

export default function MonthlyExpenseByCategory() {
  const { data: txs } = useQuery({ queryKey: ['transactions', { scope:'month-exp' }], queryFn: () => fetchTransactions() })
  const { data: cats } = useQuery({ queryKey: ['categories'], queryFn: () => fetchCategories() })

  const data = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end   = new Date(now.getFullYear(), now.getMonth()+1, 0, 23,59,59)

    const nameById = new Map((cats ?? []).map(c => [c.id, c.name]))
    const map = new Map<string, number>()

    for (const t of txs ?? []) {
      const d = new Date(t.occurred_at)
      if (d >= start && d <= end && Number(t.amount) < 0) {
        const n = nameById.get(t.category_id ?? '') ?? 'Uncategorized'
        map.set(n, (map.get(n) || 0) + Math.abs(Number(t.amount)))
      }
    }

    return Array.from(map, ([name, value]) => ({ name, value }))
  }, [txs, cats])

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="85%" />
          <Tooltip />
          <Legend />
          {/* optional cells for consistent order coloring */}
          {data.map((_, i) => <Cell key={i} />)}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
