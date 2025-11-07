'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCategories, createCategory, deleteCategory, type CategoryType } from '@/lib/api/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function CategoriesPage() {
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery({ queryKey: ['categories'], queryFn: () => fetchCategories() })
  const [tab, setTab] = useState<CategoryType>('expense')
  const [name, setName] = useState('')

  const list = useMemo(() => (data ?? []).filter(c => c.type === tab), [data, tab])

  const createMut = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('Category created')
      setName('')
      qc.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to create'),
  })

  const deleteMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success('Deleted')
      qc.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (e: any) => toast.error(e.message ?? 'Failed to delete'),
  })

  return (
    <main className="px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
      </div>

      <div className="flex gap-2">
        <Button variant={tab === 'expense' ? 'default' : 'secondary'} onClick={() => setTab('expense')}>Expense</Button>
        <Button variant={tab === 'income' ? 'default' : 'secondary'} onClick={() => setTab('income')}>Income</Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="grid md:grid-cols-6 gap-3">
          <div className="space-y-2 md:col-span-5">
            <Label>New {tab} category</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Groceries / Salary" />
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                if (!name.trim()) return toast.error('Enter a name')
                createMut.mutate({ name: name.trim(), type: tab })
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </Card>

      <Separator />

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-red-600 border border-red-200 bg-red-50 p-3 rounded">{(error as Error).message}</p>}

      <div className="grid gap-3">
        {list.map(c => (
          <Card key={c.id} className="p-4 flex items-center justify-between">
            <div className="font-medium">{c.name}</div>
            <Button variant="destructive" onClick={() => deleteMut.mutate(c.id)}>Delete</Button>
          </Card>
        ))}
        {list.length === 0 && !isLoading && !error && <p className="text-sm text-muted-foreground">No {tab} categories yet.</p>}
      </div>
    </main>
  )
}
