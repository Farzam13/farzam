import { supabase } from '@/lib/supabase'
import { matchCaregivers } from '@/lib/matching'

async function assign(patientId: string, caregiverId: string) {
  'use server'
  await supabase.from('patients').update({ assigned_caregiver_id: caregiverId }).eq('id', patientId)
}

export default async function PatientDetail({ params }: { params: { id: string } }) {
  const { data: patient } = await supabase.from('patients').select('*').eq('id', params.id).single()
  const { data: caregivers } = await supabase.from('caregivers').select('*')
  const matches = matchCaregivers(patient.payload, caregivers || [])

  return <main className="space-y-4">
    <h1 className="text-xl font-semibold">{patient.name}</h1>
    <div className="rounded bg-white p-4 shadow">
      <h2 className="font-medium">Matching Results</h2>
      {matches.map((m:any) => <form key={m.caregiver.id} action={assign.bind(null, patient.id, m.caregiver.id)} className="my-2 rounded border p-3">
        <p className="font-medium">{m.caregiver.name}</p><p className="text-sm">{m.explanation}</p>
        <button className="mt-2 rounded bg-blue-600 px-3 py-1 text-white">Assign caregiver</button>
      </form>)}
    </div>
  </main>
}
