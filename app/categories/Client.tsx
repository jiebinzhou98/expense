'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  type CategoryType,
} from '@/lib/api/categories'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function CategoriesPage() {
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  })

  const [tab, setTab] = useState<CategoryType>('expense')
  const [name, setName] = useState('')

  const list = useMemo(() => (data ?? []).filter((c) => c.type === tab), [data, tab])

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
    <main className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
      </div>

      {/* Segmented toggle (no extra deps) */}
      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        <Button
          variant={tab === 'expense' ? 'default' : 'ghost'}
          className={`rounded-md px-4 ${tab === 'expense' ? '' : 'text-slate-600'}`}
          onClick={() => setTab('expense')}
        >
          Expense
        </Button>
        <Button
          variant={tab === 'income' ? 'default' : 'ghost'}
          className={`rounded-md px-4 ${tab === 'income' ? '' : 'text-slate-600'}`}
          onClick={() => setTab('income')}
        >
          Income
        </Button>
      </div>

      {/* Create form card */}
      <Card className="p-4 rounded-xl border-slate-200 shadow-sm space-y-4">
        <div className="grid md:grid-cols-6 gap-3">
          <div className="space-y-2 md:col-span-5">
            <Label>New {tab} category</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tab === 'expense' ? 'e.g. Groceries, Rent' : 'e.g. Salary, Bonus'}
            />
          </div>
          <div className="flex items-end">
            <Button
              className="w-full rounded-lg"
              onClick={() => {
                if (!name.trim()) return toast.error('Enter a name')
                createMut.mutate({ name: name.trim(), type: tab })
              }}
              disabled={createMut.isPending}
            >
              {createMut.isPending ? 'Adding…' : 'Add'}
            </Button>
          </div>
        </div>
      </Card>

      <Separator />

      {/* States */}
      {isLoading && <p className="text-sm text-slate-500">Loading categories…</p>}
      {error && (
        <p className="text-red-600 border border-red-200 bg-red-50 p-3 rounded">
          {(error as Error).message}
        </p>
      )}

      {/* List grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <Card
            key={c.id}
            className="p-4 rounded-xl border-slate-200 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-2.5 w-2.5 rounded-full ${
                  tab === 'expense' ? 'bg-red-500' : 'bg-emerald-500'
                }`}
              />
              <div className="font-medium">{c.name}</div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-lg"
              onClick={() => {
                if (!confirm(`Delete category “${c.name}”?`)) return
                deleteMut.mutate(c.id)
              }}
            >
              Delete
            </Button>
          </Card>
        ))}

        {list.length === 0 && !isLoading && !error && (
          <Card className="p-8 rounded-xl border-dashed border-2 text-center text-slate-500">
            No {tab} categories yet. Add your first one above.
          </Card>
        )}
      </div>
    </main>
  )
}
