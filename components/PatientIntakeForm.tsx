'use client'

import { useState } from 'react'
import { PatientFormData } from '@/types'
import { supabase } from '@/lib/supabase'

const defaultData: PatientFormData = {
  name: '', age: 0, gender: '', mainCondition: '', dependencyLevel: 'semi', diseases: [], medicationsCount: 0,
  mobility: 'walk', fallHistory: false, pressureSores: false, personality: 'calm', cognitiveStatus: 'normal', behaviors: [],
  homeType: '', stairs: false, lightingQuality: '', bathroomType: '', familyPresence: '', sensitivityLevel: 'medium', culturalConstraints: '',
  careType: '', duration: '', budgetRange: ''
}

const steps = ['Basic', 'Clinical', 'Psychological', 'Environment', 'Family', 'Service']

export default function PatientIntakeForm() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState(defaultData)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [clinicId, setClinicId] = useState('')

  const update = (k: keyof PatientFormData, v: any) => setData(prev => ({ ...prev, [k]: v }))

  async function submit() {
    setAnalyzing(true)
    const { data: saved } = await supabase.from('patients').insert({ payload: data, name: data.name, main_condition: data.mainCondition }).select().single()
    const matchRes = await fetch('/api/match', { method: 'POST', body: JSON.stringify({ patient: data, clinicId }) })
    const matches = await matchRes.json()
    if (matches?.[0]?.riskLevel === 'high') {
      await supabase.from('notifications').insert({ clinic_id: clinicId, patient_id: saved?.id, level: 'critical', message: `High-risk patient alert: ${data.name}` })
    }
    setResult({ patientId: saved?.id, matches })
    setAnalyzing(false)
  }

  if (analyzing) return <div className="rounded bg-white p-6 shadow">Analyzing your case...</div>

  return <div className="space-y-4 rounded bg-white p-6 shadow">
    <h2 className="text-xl font-semibold">360 Assessment - {steps[step]}</h2>
    <input className="border p-2" placeholder="Clinic ID" value={clinicId} onChange={e=>setClinicId(e.target.value)} />
    {step===0 && <div className="grid gap-2 md:grid-cols-2">
      <input className="border p-2" placeholder="Name" onChange={e=>update('name',e.target.value)} />
      <input className="border p-2" type="number" placeholder="Age" onChange={e=>update('age',Number(e.target.value))} />
      <input className="border p-2" placeholder="Gender" onChange={e=>update('gender',e.target.value)} />
      <input className="border p-2" placeholder="Main condition" onChange={e=>update('mainCondition',e.target.value)} />
    </div>}
    {step===1 && <div className="grid gap-2 md:grid-cols-2">
      <input className="border p-2" placeholder="Diseases (comma separated)" onChange={e=>update('diseases',e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} />
      <input className="border p-2" type="number" placeholder="Medications count" onChange={e=>update('medicationsCount',Number(e.target.value))} />
      <select className="border p-2" onChange={e=>update('mobility',e.target.value)}><option>walk</option><option>walker</option><option>wheelchair</option><option>bedridden</option></select>
      <label><input type="checkbox" onChange={e=>update('fallHistory',e.target.checked)} /> Fall history</label>
      <label><input type="checkbox" onChange={e=>update('pressureSores',e.target.checked)} /> Pressure sores</label>
    </div>}
    {step===2 && <div className="grid gap-2 md:grid-cols-2">
      <select className="border p-2" onChange={e=>update('personality',e.target.value)}><option>calm</option><option>social</option><option>sensitive</option><option>aggressive</option></select>
      <select className="border p-2" onChange={e=>update('cognitiveStatus',e.target.value)}><option>normal</option><option>memory issues</option><option>dementia</option></select>
      <input className="border p-2" placeholder="Behaviors (comma separated)" onChange={e=>update('behaviors',e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} />
    </div>}
    {step===3 && <div className="grid gap-2 md:grid-cols-2">
      <input className="border p-2" placeholder="Home type" onChange={e=>update('homeType',e.target.value)} />
      <label><input type="checkbox" onChange={e=>update('stairs',e.target.checked)} /> Stairs</label>
      <input className="border p-2" placeholder="Lighting quality" onChange={e=>update('lightingQuality',e.target.value)} />
      <input className="border p-2" placeholder="Bathroom type" onChange={e=>update('bathroomType',e.target.value)} />
    </div>}
    {step===4 && <div className="grid gap-2 md:grid-cols-2">
      <input className="border p-2" placeholder="Family presence" onChange={e=>update('familyPresence',e.target.value)} />
      <select className="border p-2" onChange={e=>update('sensitivityLevel',e.target.value)}><option>low</option><option>medium</option><option>high</option></select>
      <input className="border p-2 md:col-span-2" placeholder="Cultural constraints" onChange={e=>update('culturalConstraints',e.target.value)} />
    </div>}
    {step===5 && <div className="grid gap-2 md:grid-cols-2">
      <input className="border p-2" placeholder="Type of care" onChange={e=>update('careType',e.target.value)} />
      <input className="border p-2" placeholder="Duration" onChange={e=>update('duration',e.target.value)} />
      <input className="border p-2" placeholder="Budget range" onChange={e=>update('budgetRange',e.target.value)} />
    </div>}

    <div className="flex gap-2">
      <button className="rounded border px-3 py-2" disabled={step===0} onClick={()=>setStep(step-1)}>Back</button>
      {step < 5 ? <button className="rounded bg-blue-600 px-3 py-2 text-white" onClick={()=>setStep(step+1)}>Next</button> : <button className="rounded bg-emerald-600 px-3 py-2 text-white" onClick={submit}>Submit</button>}
    </div>

    {result && <div className="rounded border p-4">
      <h3 className="font-semibold">Assessment Summary</h3>
      <p>Top caregivers selected for {data.name}. Next: generate care folder PDF.</p>
      <a className="text-blue-600 underline" href={`/api/generate-pdf?patientId=${result.patientId}`}>Download Care Folder PDF</a>
    </div>}
  </div>
}
