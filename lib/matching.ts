import { Caregiver, PatientFormData } from '@/types'

export type RiskLevel = 'low' | 'medium' | 'high'

function classifyRisk(patient: PatientFormData): RiskLevel {
  let points = 0
  if (patient.fallHistory) points += 2
  if (patient.pressureSores) points += 2
  if (patient.mobility === 'wheelchair') points += 1
  if (patient.mobility === 'bedridden') points += 3
  if (patient.cognitiveStatus === 'memory issues') points += 1
  if (patient.cognitiveStatus === 'dementia') points += 3

  if (points >= 6) return 'high'
  if (points >= 3) return 'medium'
  return 'low'
}

function buildExplanation(args: {
  caregiver: Caregiver
  riskLevel: RiskLevel
  clinicalHits: string[]
  personalityMatch: boolean
  score: number
}) {
  const { caregiver, riskLevel, clinicalHits, personalityMatch, score } = args
  const fragments: string[] = []

  if (clinicalHits.length) {
    fragments.push(`${caregiver.name} matches key clinical needs (${clinicalHits.join(', ')})`)
  } else {
    fragments.push(`${caregiver.name} is available but has limited direct clinical overlap`) 
  }

  if (personalityMatch) fragments.push('their personality style is compatible with the patient profile')
  if (riskLevel === 'high' && ['senior', 'expert'].includes(caregiver.experience_level)) {
    fragments.push('their senior experience supports high-risk care safely')
  }

  fragments.push(`overall match score: ${score}/100`)
  return fragments.join(', ') + '.'
}

export function matchCaregivers(patient: PatientFormData, caregivers: Caregiver[]) {
  const riskLevel = classifyRisk(patient)

  const ranked = caregivers.map(caregiver => {
    const clinicalHits = patient.diseases.filter(d => caregiver.skills.includes(d) || caregiver.specialties.includes(d))

    const clinicalScore = Math.min(60, clinicalHits.length * 20)
    const personalityScore = caregiver.personality_type === patient.personality ? 15 : 0
    const availabilityScore = caregiver.availability === 'full-time' ? 10 : 5

    let riskExperienceScore = 0
    if (riskLevel === 'high') riskExperienceScore = ['expert', 'senior'].includes(caregiver.experience_level) ? 15 : 3
    if (riskLevel === 'medium') riskExperienceScore = ['expert', 'senior', 'mid'].includes(caregiver.experience_level) ? 10 : 4
    if (riskLevel === 'low') riskExperienceScore = 8

    const score = Math.max(0, Math.min(100, clinicalScore + personalityScore + availabilityScore + riskExperienceScore))

    return {
      caregiver,
      score,
      riskLevel,
      explanation: buildExplanation({
        caregiver,
        riskLevel,
        clinicalHits,
        personalityMatch: personalityScore > 0,
        score
      })
    }
  })

  return ranked.sort((a, b) => b.score - a.score).slice(0, 2)
}
