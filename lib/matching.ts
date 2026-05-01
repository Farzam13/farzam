import { Caregiver, PatientFormData } from '@/types'

export type RiskLevel = 'low' | 'medium' | 'high'

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

export function matchCaregivers(patient: PatientFormData, caregivers: Caregiver[]) {
  return caregivers
    .map(caregiver => {
      const clinicalHits = patient.diseases.filter(d => caregiver.skills.includes(d) || caregiver.specialties.includes(d))
      const clinicalScore = Math.min(50, clinicalHits.length * 15)
      const personalityScore = caregiver.personality_type === patient.personality ? 30 : 10
      const experienceScore = ['expert', 'senior'].includes(caregiver.experience_level) ? 20 : 10
      const score = Math.min(100, clinicalScore + personalityScore + experienceScore)

      return {
        caregiver,
        score,
        riskLevel: computeRiskLevel(patient),
        explanation: `${caregiver.name} scored ${score}/100 with strong clinical compatibility (${clinicalScore}/50), personality alignment (${personalityScore}/30), and experience fit (${experienceScore}/20).`
      }
    })
    .sort((a, b) => b.score - a.score)
}
