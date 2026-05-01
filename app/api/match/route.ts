import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { matchCaregivers } from '@/lib/matching'

export async function POST(req: NextRequest) {
  const { patient, clinicId } = await req.json()
  const [{ data: caregivers }, { data: clinic }] = await Promise.all([
    supabase.from('caregivers').select('*').eq('clinic_id', clinicId),
    supabase.from('clinics').select('scoring_weights').eq('id', clinicId).single()
  ])

  const matches = matchCaregivers(patient, caregivers || [], clinic?.scoring_weights)
  return NextResponse.json(matches.slice(0, 5))
}
