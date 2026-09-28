export type DependencyLevel = 'independent' | 'semi' | 'dependent'
export type Mobility = 'walk' | 'walker' | 'wheelchair' | 'bedridden'

export interface PatientFormData {
  name: string
  age: number
  gender: string
  mainCondition: string
  dependencyLevel: DependencyLevel
  diseases: string[]
  medicationsCount: number
  mobility: Mobility
  fallHistory: boolean
  pressureSores: boolean
  personality: string
  cognitiveStatus: string
  behaviors: string[]
  homeType: string
  stairs: boolean
  lightingQuality: string
  bathroomType: string
  familyPresence: string
  sensitivityLevel: 'low' | 'medium' | 'high'
  culturalConstraints: string
  careType: string
  duration: string
  budgetRange: string
}

export interface Caregiver {
  id: string
  name: string
  skills: string[]
  experience_level: string
  personality_type: string
  specialties: string[]
  availability: string
}
