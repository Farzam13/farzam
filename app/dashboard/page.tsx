import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function Dashboard() {
  const [{ count: patients }, { count: caregivers }, { count: activeCases }, { data: recentPatients }] = await Promise.all([
    supabase.from('patients').select('*', { count: 'exact', head: true }),
    supabase.from('caregivers').select('*', { count: 'exact', head: true }),
    supabase.from('patients').select('*', { count: 'exact', head: true }).in('stage', ['Assigned', 'Active']),
    supabase.from('patients').select('id,name,stage,created_at').order('created_at', { ascending: false }).limit(5)
  ])

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Home Care Management Dashboard</h1>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded bg-white p-4 shadow"><p className="text-sm text-slate-500">Patients</p><p className="text-2xl font-semibold">{patients || 0}</p></div>
        <div className="rounded bg-white p-4 shadow"><p className="text-sm text-slate-500">Caregivers</p><p className="text-2xl font-semibold">{caregivers || 0}</p></div>
        <div className="rounded bg-white p-4 shadow"><p className="text-sm text-slate-500">Active Cases</p><p className="text-2xl font-semibold">{activeCases || 0}</p></div>
      </section>

      <section className="rounded bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold">Recent Activity</h2>
        {(recentPatients || []).map((p) => (
          <p key={p.id} className="border-b py-2 text-sm">{p.name} moved to <b>{p.stage}</b> ({new Date(p.created_at).toLocaleDateString('en-US')})</p>
        ))}
      </section>

      <section className="rounded bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold">CRM Pipeline</h2>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5 text-sm">
          {['Lead', 'Assessment', 'Assigned', 'Active', 'Closed'].map(stage => <div key={stage} className="rounded border p-2 text-center">{stage}</div>)}
        </div>
      </section>

      <Link href="/dashboard/patients" className="inline-block rounded bg-blue-600 px-4 py-2 text-white">Manage Patients</Link>
    </main>
  )
}
