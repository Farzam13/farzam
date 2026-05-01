import { Caregiver, PatientFormData } from '@/types'

export type RiskLevel = 'low' | 'medium' | 'high'

export interface MatchingWeights {
  clinical_weight: number
  personality_weight: number
  experience_weight: number
}

export function computeRiskLevel(assessment: PatientFormData): RiskLevel {
  let points = 0
  if (assessment.fallHistory) points += 2
  if (assessment.pressureSores) points += 2
  if (assessment.mobility === 'wheelchair') points += 1
  if (assessment.mobility === 'bedridden') points += 3
  if (assessment.cognitiveStatus === 'memory issues') points += 1
  if (assessment.cognitiveStatus === 'dementia') points += 3
  if (points >= 6) return 'high'
  if (points >= 3) return 'medium'
  return 'low'
}

export function matchCaregivers(patient: PatientFormData, caregivers: Caregiver[], weights?: MatchingWeights) {
  const cfg = weights || { clinical_weight: 50, personality_weight: 30, experience_weight: 20 }
  const risk = computeRiskLevel(patient)

  return caregivers
    .map(caregiver => {
      const clinicalHits = patient.diseases.filter(d => caregiver.skills.includes(d) || caregiver.specialties.includes(d))
      const clinicalScore = Math.min(cfg.clinical_weight, clinicalHits.length * (cfg.clinical_weight / 3))
      const personalityScore = caregiver.personality_type === patient.personality ? cfg.personality_weight : cfg.personality_weight * 0.3
      const experienceScore = ['expert', 'senior'].includes(caregiver.experience_level) ? cfg.experience_weight : cfg.experience_weight * 0.5
      const score = Math.round(Math.min(100, clinicalScore + personalityScore + experienceScore))

      const explanation = [
        `Clinical fit: ${Math.round(clinicalScore)}/${cfg.clinical_weight}${clinicalHits.length ? ` from ${clinicalHits.join(', ')}` : ' with limited disease overlap'}`,
        `Personality fit: ${Math.round(personalityScore)}/${cfg.personality_weight}`,
        `Experience fit: ${Math.round(experienceScore)}/${cfg.experience_weight}`,
        `Risk profile: ${risk}`
      ].join(' | ')

      return { caregiver, score, riskLevel: risk, explanation }
    })
    .sort((a, b) => b.score - a.score)
}
