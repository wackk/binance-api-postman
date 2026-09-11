import type { BodyAreaScore, MobilityRoutine } from '../types'

export const DEFAULT_BODY_AREA_SCORES: BodyAreaScore[] = [
  { areaName: 'Hips', scorePercentage: 78, statusLabel: 'Optimal' },
  { areaName: 'Shoulders', scorePercentage: 62, statusLabel: 'Needs Work' },
  { areaName: 'Overhead', scorePercentage: 85, statusLabel: 'Good' },
  { areaName: 'Ankles', scorePercentage: 54, statusLabel: 'Needs Work' },
  { areaName: 'Hamstrings', scorePercentage: 70, statusLabel: 'Good' },
  { areaName: 'Lower Back', scorePercentage: 88, statusLabel: 'Optimal' },
]

export const DAILY_AI_ROUTINE: MobilityRoutine = {
  id: 'ai-daily-1',
  title: 'Daily AI Mobility Protocol',
  description: 'Customized for Weightlifting & Climbing limiters (Shoulders & Ankles focus)',
  durationMinutes: 15,
  isAiGenerated: true,
  isCustom: false,
  exercises: [
    { name: 'Deep Squat Hold', durationSeconds: 120, targetArea: 'Ankles & Hips' },
    { name: 'Doorway Chest & Lats Opener', durationSeconds: 120, targetArea: 'Shoulders' },
    { name: 'Pigeon Pose Stretch', durationSeconds: 180, targetArea: 'Hips' },
    { name: 'Thoracic Spine Rotations', durationSeconds: 120, targetArea: 'T-Spine' },
    { name: 'Couch Stretch', durationSeconds: 180, targetArea: 'Quads & Hip Flexors' },
  ],
}
