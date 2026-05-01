import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { matchCaregivers } from '@/lib/matching'

export async function POST(req: NextRequest) {
  const { patient } = await req.json()
  const { data: caregivers } = await supabase.from('caregivers').select('*')
  const matches = matchCaregivers(patient, caregivers || [])
  return NextResponse.json(matches)
}
