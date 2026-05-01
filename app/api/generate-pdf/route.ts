import { NextRequest } from 'next/server'
import PDFDocument from 'pdfkit'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const patientId = new URL(req.url).searchParams.get('patientId')
  const { data: patient } = await supabase.from('patients').select('*').eq('id', patientId).single()
  const doc = new PDFDocument({ margin: 50 })
  const chunks: Buffer[] = []
  doc.on('data', c => chunks.push(c))

  doc.fontSize(18).text('Care Information Folder')
  doc.moveDown().fontSize(12).text(`Patient: ${patient?.name || '-'}`)
  doc.text(`Main Condition: ${patient?.main_condition || '-'}`)
  const payload = patient?.payload || {}
  doc.moveDown().text('Clinical Profile').text(`Diseases: ${(payload.diseases || []).join(', ')}`)
  doc.text(`Mobility: ${payload.mobility || '-'}`)
  doc.moveDown().text('Psychological Profile').text(`Personality: ${payload.personality || '-'}`)
  doc.text(`Cognitive: ${payload.cognitiveStatus || '-'}`)
  doc.moveDown().text('Home Risk Analysis').text(`Stairs: ${payload.stairs ? 'Yes' : 'No'}`)
  doc.text(`Lighting: ${payload.lightingQuality || '-'}`)
  doc.moveDown().text('Suggested Care Plan').text(`${payload.careType || '-'} for ${payload.duration || '-'}`)
  doc.end()

  await new Promise(r => doc.on('end', r))
  return new Response(Buffer.concat(chunks), { headers: { 'Content-Type': 'application/pdf' } })
}
