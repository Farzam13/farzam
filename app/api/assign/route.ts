import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { patientId, caregiverId } = await req.json()
  await supabase.from('patients').update({ assigned_caregiver_id: caregiverId }).eq('id', patientId)
  return NextResponse.json({ ok: true })
}
