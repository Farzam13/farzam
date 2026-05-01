import { Caregiver, PatientFormData } from '@/types'

export function matchCaregivers(patient: PatientFormData, caregivers: Caregiver[]) {
  const highRisk = patient.fallHistory || patient.pressureSores || patient.mobility === 'bedridden'

  const ranked = caregivers.map(c => {
    let score = 0
    const reasons: string[] = []

    const clinicalHits = patient.diseases.filter(d => c.skills.includes(d) || c.specialties.includes(d))
    score += clinicalHits.length * 25
    if (clinicalHits.length) reasons.push(`Clinical fit: ${clinicalHits.join(', ')}`)

    if (c.personality_type === patient.personality) {
      score += 20
      reasons.push('Personality compatibility')
    }

    if (highRisk && ['senior', 'expert'].includes(c.experience_level)) {
      score += 30
      reasons.push('Experienced for high-risk profile')
    }

    if (c.availability === 'full-time') score += 10

    return { caregiver: c, score, explanation: reasons.join(' | ') || 'General availability match' }
  })

  return ranked.sort((a, b) => b.score - a.score).slice(0, 2)
}
