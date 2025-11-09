'use client'

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchTransactions } from "@/lib/api/transactions"
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid} from 'recharts'

export default function MonthlyNetChart() {
  const {data: txs} = useQuery({
    queryKey: ['transactions', {scope: 'dashboard-month'}],
    queryFn: () => fetchTransactions(),
  })

  const data = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear(), m = now.getMonth()
    const days = new Date(y, m + 1, 0).getDate()
    const arr = Array.from({length: days}, (_, i) => ({day: i+1, net: 0}))
    for(const t of txs ?? []){
      const d = new Date(t.occurred_at)
      if(d.getFullYear() === y && d.getMonth() === m){
        arr[d.getDate() - 1].net += Number(t.amount)
      }
    }
    return arr
  }, [txs])

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="day" tickMargin={8}/>
          <YAxis/>
          <Tooltip/>
          <Area type="monotone" dataKey="net" fillOpacity={0.2}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}