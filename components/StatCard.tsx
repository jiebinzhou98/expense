import { Card } from '@/components/ui/card'

export default function StatCard({
  label, value, accent = 'default',
}: { label: string; value: React.ReactNode; accent?: 'default' | 'bad' | 'good' }) {
  const accentClass =
    accent === 'good' ? 'text-emerald-600' :
    accent === 'bad'  ? 'text-red-600' :
    'text-slate-900'

  return (
    <Card className="p-5 rounded-xl border-slate-200 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${accentClass}`}>{value}</div>
    </Card>
  )
}
