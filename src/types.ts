export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Forearms'
  | 'Abs'
  | 'Quadriceps'
  | 'Hamstrings'
  | 'Glutes'
  | 'Calves'
  | 'Cardio'
  | 'Full Body'
  | 'Traps'
  | 'Lats'
  | 'Neck'
  | 'Adductors'
  | 'Abductors'
  | 'Finger & Grip'

export type Equipment =
  | 'Barbell'
  | 'Dumbbell'
  | 'Machine'
  | 'Cable'
  | 'Bodyweight'
  | 'Kettlebell'
  | 'Resistance Band'
  | 'Smith Machine'
  | 'EZ Bar'
  | 'Plate'
  | 'Other'
  | 'None'

export type ExerciseLogType =
  | 'weight_reps'
  | 'bodyweight_reps'
  | 'weighted_bodyweight'
  | 'duration'
  | 'distance_duration'
  | 'reps_only'

export interface Exercise {
  id: string
  name: string
  category: MuscleGroup
  secondaryMuscles: MuscleGroup[]
  equipment: Equipment
  logType: ExerciseLogType
  instructions: string[]
  isCustom?: boolean
}

export type SetType = 'warmup' | 'normal' | 'dropset' | 'failure'

export type PRType = 'weight' | 'reps' | 'duration' | 'est1rm'

export interface WorkoutSet {
  id: string
  type: SetType
  weight: number | null
  reps: number | null
  durationSeconds: number | null
  distanceMeters: number | null
  completed: boolean
  previousWeight?: number | null
  previousReps?: number | null
  prTypes?: PRType[]
}

export interface WorkoutExerciseEntry {
  id: string
  exerciseId: string
  notes: string
  restSeconds: number
  sets: WorkoutSet[]
  supersetGroup: string | null
}

export interface Routine {
  id: string
  name: string
  notes: string
  exercises: WorkoutExerciseEntry[]
  createdAt: string
  updatedAt: string
  folderId?: string | null
}

export interface RoutineFolder {
  id: string
  name: string
  colorHex: string
}

export interface ActiveWorkoutSession {
  id: string
  name: string
  routineId: string | null
  startedAt: string
  exercises: WorkoutExerciseEntry[]
}

export interface WorkoutLog {
  id: string
  name: string
  notes: string
  routineId: string | null
  startedAt: string
  endedAt: string
  durationSeconds: number
  exercises: WorkoutExerciseEntry[]
  totalVolume: number
  totalSets: number
  prIds: string[]
}

export interface PersonalRecord {
  exerciseId: string
  bestWeight: number
  bestWeightReps: number
  bestEst1RM: number
  bestVolumeInSet: number
  achievedAt: string
}

// ---- Climbing ----

export type ClimbType = 'Bouldering' | 'Sport'

export interface ClimbEntry {
  id: string
  type: ClimbType
  grade: string
  styleTags: string[]
  attempts: number
  isSend: boolean
  timestampMs: number
  location: string
}

// ---- Mobility ----

export interface BodyAreaScore {
  areaName: string
  scorePercentage: number
  statusLabel: string
}

export interface MobilityStretch {
  name: string
  durationSeconds: number
  targetArea: string
}

export type StretchEquipment = 'None' | 'Wall' | 'Strap or Towel' | 'Foam Roller' | 'Chair or Bench' | 'Pull-up Bar' | 'Other'

/** A library stretch — richer than the lightweight MobilityStretch embedded in a routine, with full how-to instructions. */
export interface Stretch {
  id: string
  name: string
  targetArea: string
  equipment: StretchEquipment
  defaultDurationSeconds: number
  instructions: string[]
  cue?: string
}

export interface MobilityRoutine {
  id: string
  title: string
  description: string
  durationMinutes: number
  exercises: MobilityStretch[]
  isAiGenerated: boolean
  isCustom: boolean
}

export interface MobilityLog {
  id: string
  routineId: string
  routineTitle: string
  completedAt: string
  durationSeconds: number
  exercisesDone: string[]
}

// ---- Profile ----

export type WeightUnit = 'kg' | 'lbs'

export interface UserProfile {
  username: string
  sex: string
  bio: string
  avatarColorIndex: number
}

export interface UserSettings {
  weightUnit: WeightUnit
  defaultRestTimerSec: number
  workoutReminders: boolean
  climbingAlerts: boolean
  mobilityReminders: boolean
  boulderingGradeSystem: string
  dailyMobilityTargetMins: number
  soundEffectsEnabled: boolean
}

// ---- Achievements ----

export type AchievementCategory = 'streak' | 'workouts' | 'prs'
