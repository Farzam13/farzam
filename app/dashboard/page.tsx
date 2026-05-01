import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function Dashboard() {
  const { data: patients } = await supabase.from('patients').select('*').order('created_at', { ascending: false })
  return <main className="space-y-4">
    <h1 className="text-2xl font-bold">Operations Dashboard</h1>
    <div className="rounded bg-white p-4 shadow">
      {(patients || []).map(p => <Link key={p.id} href={`/dashboard/patients/${p.id}`} className="block border-b p-2 hover:bg-slate-50">{p.name} — {p.main_condition}</Link>)}
    </div>
  </main>
}
