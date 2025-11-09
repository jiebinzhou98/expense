export default function Section({
  title, desc, children, className = '',
}: { title: string; desc?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`space-y-4 ${className}`}>
      <header>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {desc && <p className="text-sm text-slate-500 mt-1">{desc}</p>}
      </header>
      {children}
    </section>
  )
}
