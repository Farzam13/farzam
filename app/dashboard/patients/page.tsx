import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function PatientsPage() {
  const { data: patients } = await supabase.from('patients').select('*').order('created_at', { ascending: false })
  return <main className="space-y-3">
    <h1 className="text-xl font-semibold">Patients</h1>
    {(patients || []).map(p => <Link key={p.id} href={`/dashboard/patients/${p.id}`} className="block rounded border bg-white p-3">{p.name} — {p.stage} — risk: {p.risk_level || '-'}</Link>)}
  </main>
}
