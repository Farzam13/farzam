import Link from 'next/link'

export default function Home() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">Smart Home Care Matching Platform</h1>
      <p className="text-slate-600">MVP for intake, matching, PDF care folder, and operations dashboard.</p>
      <div className="flex gap-3">
        <Link href="/intake" className="rounded bg-blue-600 px-4 py-2 text-white">Start 360 Assessment</Link>
        <Link href="/dashboard" className="rounded border px-4 py-2">Open Dashboard</Link>
      </div>
    </main>
  )
}
