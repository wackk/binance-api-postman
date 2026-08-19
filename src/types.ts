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
  folder?: string | null
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
