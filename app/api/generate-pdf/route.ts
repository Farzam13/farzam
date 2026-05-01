import { NextRequest } from 'next/server'
import PDFDocument from 'pdfkit'
import { supabase } from '@/lib/supabase'
import { matchCaregivers } from '@/lib/matching'

function sectionTitle(doc: PDFKit.PDFDocument, title: string) {
  doc.moveDown(1.2)
  doc.fontSize(14).fillColor('#0f172a').text(title)
  doc.moveDown(0.4)
  doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke()
  doc.moveDown(0.6)
}

export async function GET(req: NextRequest) {
  const patientId = new URL(req.url).searchParams.get('patientId')
  const { data: patient } = await supabase.from('patients').select('*').eq('id', patientId).single()
  const { data: caregivers } = await supabase.from('caregivers').select('*')

  const payload = patient?.payload || {}
  const matches = matchCaregivers(payload, caregivers || [])
  const topMatch = matches[0]

  const doc = new PDFDocument({ margin: 50, size: 'A4' })
  const chunks: Buffer[] = []
  doc.on('data', c => chunks.push(c))

  doc.fontSize(20).fillColor('#0f172a').text('Care Information Folder', { align: 'left' })
  doc.moveDown(0.2)
  doc.fontSize(10).fillColor('#64748b').text(`Generated: ${new Date().toLocaleString('en-US')}`)

  sectionTitle(doc, 'Patient Summary')
  doc.fontSize(11).fillColor('#111827')
  doc.text(`Name: ${patient?.name || '-'}`)
  doc.text(`Main condition: ${patient?.main_condition || '-'}`)
  doc.text(`Dependency level: ${payload.dependencyLevel || '-'}`)
  doc.text(`Risk level: ${topMatch?.riskLevel || 'unknown'}`)

  sectionTitle(doc, 'Clinical Profile')
  doc.text(`Diseases: ${(payload.diseases || []).join(', ') || '-'}`)
  doc.text(`Medications count: ${payload.medicationsCount ?? '-'}`)
  doc.text(`Mobility: ${payload.mobility || '-'}`)
  doc.text(`Risks: fall history (${payload.fallHistory ? 'yes' : 'no'}), pressure sores (${payload.pressureSores ? 'yes' : 'no'})`)

  sectionTitle(doc, 'Psychological Profile')
  doc.text(`Personality: ${payload.personality || '-'}`)
  doc.text(`Cognitive status: ${payload.cognitiveStatus || '-'}`)
  doc.text(`Behaviors: ${(payload.behaviors || []).join(', ') || '-'}`)

  sectionTitle(doc, 'Home Risk Analysis')
  doc.text(`Home type: ${payload.homeType || '-'}`)
  doc.text(`Stairs: ${payload.stairs ? 'yes' : 'no'}`)
  doc.text(`Lighting quality: ${payload.lightingQuality || '-'}`)
  doc.text(`Bathroom type: ${payload.bathroomType || '-'}`)

  sectionTitle(doc, 'Suggested Care Plan')
  doc.text(`Care type: ${payload.careType || '-'}`)
  doc.text(`Duration: ${payload.duration || '-'}`)
  doc.text(`Budget range: ${payload.budgetRange || '-'}`)

  sectionTitle(doc, 'Recommended Caregiver Profile')
  if (topMatch) {
    doc.text(`Primary recommendation: ${topMatch.caregiver.name}`)
    doc.text(`Match score: ${topMatch.score}/100`)
    doc.text(`Why selected: ${topMatch.explanation}`)
  } else {
    doc.text('No caregiver recommendation available yet.')
  }

  doc.end()
  await new Promise(r => doc.on('end', r))
  return new Response(Buffer.concat(chunks), { headers: { 'Content-Type': 'application/pdf' } })
}
