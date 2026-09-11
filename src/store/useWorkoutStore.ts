import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type {
  ActiveWorkoutSession,
  BodyAreaScore,
  ClimbEntry,
  ClimbType,
  Exercise,
  MobilityLog,
  MobilityRoutine,
  PRType,
  Routine,
  RoutineFolder,
  SetType,
  UserProfile,
  UserSettings,
  WorkoutExerciseEntry,
  WorkoutLog,
  WorkoutSet,
} from '../types'
import { EXERCISE_LIBRARY } from '../data/exercises'
import { estOneRepMax, relativeDate } from '../lib/format'
import { DEFAULT_BODY_AREA_SCORES, DAILY_AI_ROUTINE } from '../data/mobility'
import { BOULDER_GRADES, SPORT_GRADES, boulderGradeIndex, sportGradeIndex } from '../data/climbing'
import { ACHIEVEMENTS } from '../data/achievements'
import { useToastStore } from './useToastStore'
import { playCelebrationSound, playTimerAlarm } from '../lib/sound'

const FOLDER_COLORS = ['#4DA1FF', '#FF9F0A', '#00E676', '#FF6B6B', '#9B5DE5']

const PR_LABELS: Record<PRType, string> = {
  weight: 'Weight PR',
  reps: 'Reps PR',
  duration: 'Duration PR',
  est1rm: 'Est. 1RM PR',
}

export interface RoutineStats {
  lastPerformedText: string
  estimatedDurationMinutes: number
}

export interface ClimbingStats {
  highestBoulderGrade: string
  highestSportGrade: string
  avgClimbsPerSession: number
}

export interface CombinedStats {
  workoutCount: number
  totalVolumeKg: number
  prCount: number
  totalClimbs: number
  highestBoulder: string
  highestSport: string
  mobilitySessions: number
  totalMobilityMinutes: number
  topAreaFocus: string
}

export type ActivityMetric = 'duration' | 'volume' | 'reps' | 'climbing' | 'mobility'

export interface DailyActivityPoint {
  dayLabel: string
  dateMs: number
  value: number
}

export interface ExerciseBests {
  maxWeight: number | null
  maxReps: number | null
  maxDuration: number | null
}

export interface ActivityStreak {
  current: number
  longest: number
}

interface MiniSet {
  weight: number | null
  reps: number | null
  durationSeconds: number | null
}

/**
 * A set earns a medal when it beats everything that came before it for this
 * exercise (past workouts plus any earlier completed sets in the same
 * session): heaviest weight ever, most reps at that weight or heavier,
 * longest hold for duration-based exercises, and the highest estimated
 * one-rep max.
 */
function computePRFlags(target: MiniSet, priorSets: MiniSet[], isDurationExercise: boolean): PRType[] {
  const targetWeight = target.weight ?? 0
  let maxWeight = 0
  let maxDuration = 0
  let bestEst1RM = 0
  let repsBaseline = 0

  for (const s of priorSets) {
    const sw = s.weight ?? 0
    if (sw > maxWeight) maxWeight = sw
    if (s.durationSeconds != null && s.durationSeconds > maxDuration) maxDuration = s.durationSeconds
    if (s.reps != null) {
      if (s.weight != null && s.weight > 0) bestEst1RM = Math.max(bestEst1RM, estOneRepMax(s.weight, s.reps))
      if (sw >= targetWeight) repsBaseline = Math.max(repsBaseline, s.reps)
    }
  }

  const flags: PRType[] = []
  if (target.weight != null && target.weight > 0 && targetWeight > maxWeight) flags.push('weight')
  if (target.reps != null && target.reps > 0 && target.reps > repsBaseline) flags.push('reps')
  if (isDurationExercise && target.durationSeconds != null && target.durationSeconds > maxDuration) flags.push('duration')
  if (target.weight != null && target.weight > 0 && target.reps != null) {
    const e1rm = estOneRepMax(target.weight, target.reps)
    if (e1rm > bestEst1RM) flags.push('est1rm')
  }
  return flags
}

interface RestTimerState {
  running: boolean
  endsAt: number | null
  totalSeconds: number
}

export type UtilityTimerMode = 'timer' | 'stopwatch'

interface UtilityTimerState {
  mode: UtilityTimerMode
  timerTotalSeconds: number
  timerRemainingSeconds: number
  timerRunning: boolean
  timerEndsAt: number | null
  stopwatchElapsedSeconds: number
  stopwatchRunning: boolean
  stopwatchStartedAt: number | null
}

interface WorkoutStore {
  customExercises: Exercise[]
  routines: Routine[]
  folders: RoutineFolder[]
  history: WorkoutLog[]
  activeWorkout: ActiveWorkoutSession | null
  restTimer: RestTimerState
  utilityTimer: UtilityTimerState
  climbs: ClimbEntry[]
  mobilityRoutines: MobilityRoutine[]
  mobilityLogs: MobilityLog[]
  bodyAreaScores: BodyAreaScore[]
  assessmentCompletedAt: string | null
  profile: UserProfile
  settings: UserSettings
  achievements: Record<string, string>

  // exercise library
  addCustomExercise: (e: Omit<Exercise, 'id' | 'isCustom'>) => Exercise
  updateCustomExercise: (id: string, patch: Partial<Omit<Exercise, 'id' | 'isCustom'>>) => void
  getAllExercises: () => Exercise[]
  getExerciseById: (id: string) => Exercise | undefined

  // routines
  createRoutine: (name: string) => Routine
  updateRoutine: (routine: Routine) => void
  deleteRoutine: (id: string) => void
  duplicateRoutine: (id: string) => void
  getRoutineStats: (routineId: string) => RoutineStats

  // routine folders
  createFolder: (name: string) => RoutineFolder
  deleteFolder: (id: string) => void
  renameFolder: (id: string, name: string) => void

  // active workout
  startEmptyWorkout: () => void
  startWorkoutFromRoutine: (routineId: string) => void
  cancelActiveWorkout: () => void
  addExerciseToActive: (exerciseId: string) => void
  removeExerciseFromActive: (entryId: string) => void
  addSet: (entryId: string) => void
  removeSet: (entryId: string, setId: string) => void
  updateSet: (entryId: string, setId: string, patch: Partial<WorkoutSet>) => void
  setSetType: (entryId: string, setId: string, type: SetType) => void
  toggleSetCompleted: (entryId: string, setId: string) => void
  updateEntryNotes: (entryId: string, notes: string) => void
  updateEntryRest: (entryId: string, seconds: number) => void
  reorderActiveExercise: (entryId: string, direction: 'up' | 'down') => void
  finishWorkout: (params: { name: string; notes: string; endedAt: string; durationSeconds: number }) => WorkoutLog | null
  renameActiveWorkout: (name: string) => void
  getSetPRFlags: (entryId: string, setId: string) => PRType[]
  getExerciseBests: (exerciseId: string) => ExerciseBests

  // rest timer
  startRestTimer: (seconds: number) => void
  stopRestTimer: () => void
  adjustRestTimer: (deltaSeconds: number) => void

  // standalone timer & stopwatch
  setUtilityTimerMode: (mode: UtilityTimerMode) => void
  setTimerDuration: (seconds: number) => void
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  completeTimer: () => void
  startStopwatch: () => void
  pauseStopwatch: () => void
  resetStopwatch: () => void

  // history helpers
  getLastPerformance: (exerciseId: string) => WorkoutExerciseEntry | undefined
  getPersonalRecordWeight: (exerciseId: string) => number | null
  deleteWorkoutLog: (id: string) => void
  updateWorkoutLog: (id: string, patch: Partial<Pick<WorkoutLog, 'name' | 'notes' | 'endedAt' | 'durationSeconds'>>) => void

  // climbing
  logClimb: (params: {
    type: ClimbType
    grade: string
    styleTags: string[]
    attempts: number
    isSend: boolean
    timestampMs: number
  }) => void
  deleteClimb: (id: string) => void
  getClimbingStats: () => ClimbingStats

  // mobility
  createMobilityRoutine: (title: string, description: string, durationMinutes: number) => MobilityRoutine
  updateMobilityRoutine: (
    id: string,
    patch: Partial<Pick<MobilityRoutine, 'title' | 'description' | 'durationMinutes' | 'exercises'>>,
  ) => void
  deleteMobilityRoutine: (id: string) => void
  logMobilitySession: (routine: MobilityRoutine, durationSeconds: number) => void
  completeAssessment: (scores: BodyAreaScore[]) => void

  // profile & settings
  updateProfile: (patch: Partial<UserProfile>) => void
  updateSettings: (patch: Partial<UserSettings>) => void
  getCombinedStats: () => CombinedStats
  getDailyActivity: (metric: ActivityMetric, days: number) => DailyActivityPoint[]

  // achievements
  getActivityStreak: () => ActivityStreak
  checkAchievements: () => void

  // demo data
  loadDemoData: () => void
}

function emptySet(prev?: WorkoutSet | null): WorkoutSet {
  return {
    id: nanoid(8),
    type: 'normal',
    weight: null,
    reps: null,
    durationSeconds: null,
    distanceMeters: null,
    completed: false,
    previousWeight: prev?.weight ?? null,
    previousReps: prev?.reps ?? null,
  }
}

function makeEntry(exerciseId: string, defaultRestSeconds: number, previous?: WorkoutExerciseEntry): WorkoutExerciseEntry {
  return {
    id: nanoid(8),
    exerciseId,
    notes: '',
    restSeconds: defaultRestSeconds,
    supersetGroup: null,
    sets: previous
      ? previous.sets.map((s) => emptySet(s))
      : [emptySet(), emptySet(), emptySet()],
  }
}

const DAY_MS = 86400000

function demoCompletedSet(weight: number, reps: number): WorkoutSet {
  return { id: nanoid(8), type: 'normal', weight, reps, durationSeconds: null, distanceMeters: null, completed: true }
}

function demoEntry(exerciseId: string, sets: [number, number][], restSeconds = 90): WorkoutExerciseEntry {
  return {
    id: nanoid(8),
    exerciseId,
    notes: '',
    restSeconds,
    supersetGroup: null,
    sets: sets.map(([w, r]) => demoCompletedSet(w, r)),
  }
}

function demoRoutineEntry(exerciseId: string, weight: number, reps: number, setCount: number, restSeconds = 90): WorkoutExerciseEntry {
  return {
    id: nanoid(8),
    exerciseId,
    notes: '',
    restSeconds,
    supersetGroup: null,
    sets: Array.from({ length: setCount }, () => ({
      id: nanoid(8),
      type: 'normal' as const,
      weight,
      reps,
      durationSeconds: null,
      distanceMeters: null,
      completed: false,
    })),
  }
}

function buildDemoData(now: number) {
  const pplFolder: RoutineFolder = { id: nanoid(8), name: 'Push Pull Legs', colorHex: '#4DA1FF' }
  const strengthFolder: RoutineFolder = { id: nanoid(8), name: 'Strength & Power', colorHex: '#FF9F0A' }
  const folders = [pplFolder, strengthFolder]

  const iso = (daysAgo: number) => new Date(now - daysAgo * DAY_MS).toISOString()

  const pushRoutine: Routine = {
    id: nanoid(8),
    name: 'Push Day A',
    notes: 'Chest, shoulders & triceps',
    folderId: pplFolder.id,
    createdAt: iso(20),
    updatedAt: iso(20),
    exercises: [
      demoRoutineEntry('bb-bench-press', 62.5, 8, 3),
      demoRoutineEntry('ohp-barbell', 37.5, 8, 3),
      demoRoutineEntry('lateral-raise', 9, 12, 3),
      demoRoutineEntry('tricep-pushdown', 27.5, 12, 3),
    ],
  }
  const pullRoutine: Routine = {
    id: nanoid(8),
    name: 'Pull Day A',
    notes: 'Back & biceps',
    folderId: pplFolder.id,
    createdAt: iso(20),
    updatedAt: iso(20),
    exercises: [
      demoRoutineEntry('deadlift', 105, 5, 3),
      demoRoutineEntry('bb-bent-over-row', 52.5, 8, 3),
      demoRoutineEntry('lat-pulldown', 47.5, 10, 3),
      demoRoutineEntry('bb-curl', 22.5, 10, 3),
    ],
  }
  const legsRoutine: Routine = {
    id: nanoid(8),
    name: 'Leg Day A',
    notes: 'Quads, hamstrings & calves',
    folderId: pplFolder.id,
    createdAt: iso(20),
    updatedAt: iso(20),
    exercises: [
      demoRoutineEntry('back-squat', 75, 6, 4),
      demoRoutineEntry('rdl', 65, 8, 3),
      demoRoutineEntry('leg-press', 130, 12, 3),
      demoRoutineEntry('standing-calf-raise', 45, 15, 3),
    ],
  }
  const upperRoutine: Routine = {
    id: nanoid(8),
    name: 'Upper Body Strength',
    notes: 'Heavier, lower reps',
    folderId: strengthFolder.id,
    createdAt: iso(15),
    updatedAt: iso(15),
    exercises: [
      demoRoutineEntry('bb-bench-press', 72.5, 5, 3),
      demoRoutineEntry('ohp-barbell', 40, 5, 3),
      demoRoutineEntry('pull-up', 5, 8, 3),
      demoRoutineEntry('bb-bent-over-row', 55, 8, 3),
    ],
  }
  const routines = [pushRoutine, pullRoutine, legsRoutine, upperRoutine]

  function log(
    routine: Routine,
    daysAgo: number,
    durationMinutes: number,
    exercises: WorkoutExerciseEntry[],
    prIds: string[],
  ): WorkoutLog {
    const totalVolume = exercises.reduce((n, e) => n + e.sets.reduce((m, s) => m + (s.weight && s.reps ? s.weight * s.reps : 0), 0), 0)
    const totalSets = exercises.reduce((n, e) => n + e.sets.length, 0)
    const startedAt = new Date(now - daysAgo * DAY_MS - durationMinutes * 60000)
    return {
      id: nanoid(8),
      name: routine.name,
      notes: '',
      routineId: routine.id,
      startedAt: startedAt.toISOString(),
      endedAt: iso(daysAgo),
      durationSeconds: durationMinutes * 60,
      exercises,
      totalVolume,
      totalSets,
      prIds,
    }
  }

  const history: WorkoutLog[] = [
    log(pushRoutine, 17, 52, [
      demoEntry('bb-bench-press', [[60, 8], [60, 8], [65, 6]]),
      demoEntry('ohp-barbell', [[35, 8], [35, 8], [35, 8]]),
      demoEntry('lateral-raise', [[8, 12], [8, 12], [8, 12]]),
      demoEntry('tricep-pushdown', [[25, 12], [25, 12], [25, 12]]),
    ], ['bb-bench-press', 'ohp-barbell', 'lateral-raise', 'tricep-pushdown']),
    log(pullRoutine, 15, 48, [
      demoEntry('deadlift', [[100, 5], [100, 5], [105, 5]]),
      demoEntry('bb-bent-over-row', [[50, 8], [50, 8], [50, 8]]),
      demoEntry('lat-pulldown', [[45, 10], [45, 10], [45, 10]]),
      demoEntry('bb-curl', [[20, 10], [20, 10], [20, 10]]),
    ], ['deadlift', 'bb-bent-over-row', 'lat-pulldown', 'bb-curl']),
    log(legsRoutine, 13, 55, [
      demoEntry('back-squat', [[70, 8], [70, 8], [75, 6], [75, 6]]),
      demoEntry('rdl', [[60, 8], [60, 8], [60, 8]]),
      demoEntry('leg-press', [[120, 12], [120, 12], [120, 12]]),
      demoEntry('standing-calf-raise', [[40, 15], [40, 15], [40, 15]]),
    ], ['back-squat', 'rdl', 'leg-press', 'standing-calf-raise']),
    log(pushRoutine, 10, 54, [
      demoEntry('bb-bench-press', [[62.5, 8], [62.5, 8], [67.5, 6]]),
      demoEntry('ohp-barbell', [[37.5, 8], [37.5, 8], [37.5, 8]]),
      demoEntry('lateral-raise', [[9, 12], [9, 12], [9, 12]]),
      demoEntry('tricep-pushdown', [[27.5, 12], [27.5, 12], [27.5, 12]]),
    ], ['bb-bench-press', 'ohp-barbell', 'lateral-raise', 'tricep-pushdown']),
    log(pullRoutine, 7, 50, [
      demoEntry('deadlift', [[105, 5], [105, 5], [110, 5]]),
      demoEntry('bb-bent-over-row', [[52.5, 8], [52.5, 8], [52.5, 8]]),
      demoEntry('lat-pulldown', [[47.5, 10], [47.5, 10], [47.5, 10]]),
      demoEntry('bb-curl', [[22.5, 10], [22.5, 10], [22.5, 10]]),
    ], ['deadlift', 'bb-bent-over-row', 'lat-pulldown', 'bb-curl']),
    log(legsRoutine, 4, 57, [
      demoEntry('back-squat', [[75, 8], [75, 8], [80, 6], [80, 6]]),
      demoEntry('rdl', [[65, 8], [65, 8], [65, 8]]),
      demoEntry('leg-press', [[130, 12], [130, 12], [130, 12]]),
      demoEntry('standing-calf-raise', [[45, 15], [45, 15], [45, 15]]),
    ], ['back-squat', 'rdl', 'leg-press', 'standing-calf-raise']),
    log(upperRoutine, 1, 42, [
      demoEntry('bb-bench-press', [[70, 5], [70, 5], [72.5, 5]]),
      demoEntry('ohp-barbell', [[40, 5], [40, 5], [40, 5]]),
      demoEntry('pull-up', [[5, 8], [5, 8], [5, 8]]),
      demoEntry('bb-bent-over-row', [[55, 8], [55, 8], [55, 8]]),
    ], ['bb-bench-press', 'ohp-barbell', 'pull-up', 'bb-bent-over-row']),
  ]

  function climb(daysAgo: number, hoursAgo: number, type: ClimbType, grade: string, styleTags: string[], attempts: number, isSend: boolean): ClimbEntry {
    return {
      id: nanoid(8),
      type,
      grade,
      styleTags,
      attempts,
      isSend,
      timestampMs: now - daysAgo * DAY_MS - hoursAgo * 3600000,
      location: 'Local Gym',
    }
  }

  const climbs: ClimbEntry[] = [
    climb(18, 3, 'Bouldering', 'V4', ['Dynamic', 'Slab'], 2, true),
    climb(18, 2, 'Bouldering', 'V4', ['Technical'], 1, true),
    climb(18, 1, 'Bouldering', 'V5', ['Power'], 4, false),
    climb(14, 2, 'Sport', '5.9', ['Pumpy'], 2, true),
    climb(14, 1, 'Sport', '5.10a', ['Technical'], 3, true),
    climb(9, 4, 'Bouldering', 'V5', ['Crimps'], 2, true),
    climb(9, 3, 'Bouldering', 'V5', ['Overhang'], 3, true),
    climb(9, 2, 'Bouldering', 'V6', ['Power'], 5, false),
    climb(9, 1, 'Bouldering', 'V4', ['Slab'], 1, true),
    climb(5, 2, 'Sport', '5.10b', ['Technical'], 2, true),
    climb(5, 1, 'Sport', '5.10c', ['Pumpy'], 4, false),
    climb(2, 2, 'Bouldering', 'V6', ['Dynamic'], 3, true),
    climb(2, 1, 'Bouldering', 'V6', ['Crimps'], 2, true),
    climb(2, 0.5, 'Bouldering', 'V7', ['Power'], 6, false),
    climb(0, 2, 'Bouldering', 'V6', ['Overhang'], 2, true),
  ]

  const customMobilityRoutine: MobilityRoutine = {
    id: nanoid(8),
    title: 'Post-Climbing Forearm & Shoulder Unwind',
    description: 'Relieve tight forearms and shoulders after bouldering',
    durationMinutes: 12,
    isAiGenerated: false,
    isCustom: true,
    exercises: [
      { name: 'Wrist Flexor Wall Stretch', durationSeconds: 120, targetArea: 'Forearms' },
      { name: 'Puppy Pose Lat Stretch', durationSeconds: 180, targetArea: 'Shoulders' },
      { name: 'Thread the Needle', durationSeconds: 120, targetArea: 'Thoracic Spine' },
    ],
  }

  const mobilityLogs: MobilityLog[] = [
    {
      id: nanoid(8),
      routineId: 'ai-daily-1',
      routineTitle: DAILY_AI_ROUTINE.title,
      completedAt: iso(9),
      durationSeconds: 15 * 60,
      exercisesDone: DAILY_AI_ROUTINE.exercises.map((e) => e.name),
    },
    {
      id: nanoid(8),
      routineId: customMobilityRoutine.id,
      routineTitle: customMobilityRoutine.title,
      completedAt: iso(6),
      durationSeconds: 12 * 60,
      exercisesDone: customMobilityRoutine.exercises.map((e) => e.name),
    },
    {
      id: nanoid(8),
      routineId: 'ai-daily-1',
      routineTitle: DAILY_AI_ROUTINE.title,
      completedAt: iso(3),
      durationSeconds: 14 * 60,
      exercisesDone: DAILY_AI_ROUTINE.exercises.map((e) => e.name),
    },
    {
      id: nanoid(8),
      routineId: customMobilityRoutine.id,
      routineTitle: customMobilityRoutine.title,
      completedAt: iso(1),
      durationSeconds: 11 * 60,
      exercisesDone: customMobilityRoutine.exercises.map((e) => e.name),
    },
  ]

  return { folders, routines, history, climbs, mobilityRoutines: [customMobilityRoutine], mobilityLogs }
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      customExercises: [],
      routines: [],
      folders: [],
      history: [],
      activeWorkout: null,
      restTimer: { running: false, endsAt: null, totalSeconds: 90 },
      utilityTimer: {
        mode: 'timer',
        timerTotalSeconds: 60,
        timerRemainingSeconds: 60,
        timerRunning: false,
        timerEndsAt: null,
        stopwatchElapsedSeconds: 0,
        stopwatchRunning: false,
        stopwatchStartedAt: null,
      },
      climbs: [],
      mobilityRoutines: [],
      mobilityLogs: [],
      bodyAreaScores: DEFAULT_BODY_AREA_SCORES,
      assessmentCompletedAt: null,
      profile: { username: 'Athlete', sex: 'Prefer not to say', bio: '', avatarColorIndex: 0 },
      settings: {
        weightUnit: 'kg',
        defaultRestTimerSec: 90,
        workoutReminders: true,
        climbingAlerts: true,
        mobilityReminders: true,
        boulderingGradeSystem: 'V-Scale',
        dailyMobilityTargetMins: 15,
        soundEffectsEnabled: true,
      },
      achievements: {},

      addCustomExercise: (e) => {
        const exercise: Exercise = { ...e, id: `custom-${nanoid(8)}`, isCustom: true }
        set((s) => ({ customExercises: [...s.customExercises, exercise] }))
        return exercise
      },
      updateCustomExercise: (id, patch) => {
        set((s) => ({
          customExercises: s.customExercises.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }))
      },
      getAllExercises: () => [...EXERCISE_LIBRARY, ...get().customExercises],
      getExerciseById: (id) => get().getAllExercises().find((e) => e.id === id),

      createRoutine: (name) => {
        const routine: Routine = {
          id: nanoid(8),
          name,
          notes: '',
          exercises: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((s) => ({ routines: [...s.routines, routine] }))
        return routine
      },
      updateRoutine: (routine) => {
        set((s) => ({
          routines: s.routines.map((r) =>
            r.id === routine.id ? { ...routine, updatedAt: new Date().toISOString() } : r,
          ),
        }))
      },
      deleteRoutine: (id) => {
        set((s) => ({ routines: s.routines.filter((r) => r.id !== id) }))
      },
      duplicateRoutine: (id) => {
        const original = get().routines.find((r) => r.id === id)
        if (!original) return
        const copy: Routine = {
          ...original,
          id: nanoid(8),
          name: `${original.name} Copy`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          exercises: original.exercises.map((e) => ({
            ...e,
            id: nanoid(8),
            sets: e.sets.map((st) => ({ ...st, id: nanoid(8), completed: false })),
          })),
        }
        set((s) => ({ routines: [...s.routines, copy] }))
      },
      getRoutineStats: (routineId) => {
        const routine = get().routines.find((r) => r.id === routineId)
        const logs = get().history.filter((h) => h.routineId === routineId)
        const lastPerformedText = logs.length > 0 ? relativeDate(logs[0].endedAt) : 'Never'
        const estimatedDurationMinutes =
          logs.length > 0
            ? Math.round(logs.slice(0, 3).reduce((sum, l) => sum + l.durationSeconds, 0) / logs.slice(0, 3).length / 60)
            : Math.round((routine?.exercises.reduce((n, e) => n + e.sets.length, 0) ?? 0) * 3)
        return { lastPerformedText, estimatedDurationMinutes }
      },

      createFolder: (name) => {
        const folder: RoutineFolder = {
          id: nanoid(8),
          name,
          colorHex: FOLDER_COLORS[get().folders.length % FOLDER_COLORS.length],
        }
        set((s) => ({ folders: [...s.folders, folder] }))
        return folder
      },
      deleteFolder: (id) => {
        set((s) => ({
          folders: s.folders.filter((f) => f.id !== id),
          routines: s.routines.map((r) => (r.folderId === id ? { ...r, folderId: null } : r)),
        }))
      },
      renameFolder: (id, name) => {
        set((s) => ({ folders: s.folders.map((f) => (f.id === id ? { ...f, name } : f)) }))
      },

      startEmptyWorkout: () => {
        set({
          activeWorkout: {
            id: nanoid(8),
            name: 'Workout',
            routineId: null,
            startedAt: new Date().toISOString(),
            exercises: [],
          },
        })
      },
      startWorkoutFromRoutine: (routineId) => {
        const routine = get().routines.find((r) => r.id === routineId)
        if (!routine) return
        set({
          activeWorkout: {
            id: nanoid(8),
            name: routine.name,
            routineId: routine.id,
            startedAt: new Date().toISOString(),
            exercises: routine.exercises.map((e) => {
              const last = get().getLastPerformance(e.exerciseId)
              return makeEntry(e.exerciseId, e.restSeconds, last)
            }),
          },
        })
      },
      cancelActiveWorkout: () =>
        set({
          activeWorkout: null,
          restTimer: { running: false, endsAt: null, totalSeconds: get().settings.defaultRestTimerSec },
        }),
      renameActiveWorkout: (name) => {
        const w = get().activeWorkout
        if (!w) return
        set({ activeWorkout: { ...w, name } })
      },
      addExerciseToActive: (exerciseId) => {
        const w = get().activeWorkout
        if (!w) return
        const last = get().getLastPerformance(exerciseId)
        set({
          activeWorkout: {
            ...w,
            exercises: [...w.exercises, makeEntry(exerciseId, get().settings.defaultRestTimerSec, last)],
          },
        })
      },
      removeExerciseFromActive: (entryId) => {
        const w = get().activeWorkout
        if (!w) return
        set({ activeWorkout: { ...w, exercises: w.exercises.filter((e) => e.id !== entryId) } })
      },
      addSet: (entryId) => {
        const w = get().activeWorkout
        if (!w) return
        set({
          activeWorkout: {
            ...w,
            exercises: w.exercises.map((e) =>
              e.id === entryId
                ? { ...e, sets: [...e.sets, emptySet(e.sets[e.sets.length - 1])] }
                : e,
            ),
          },
        })
      },
      removeSet: (entryId, setId) => {
        const w = get().activeWorkout
        if (!w) return
        set({
          activeWorkout: {
            ...w,
            exercises: w.exercises.map((e) =>
              e.id === entryId ? { ...e, sets: e.sets.filter((s) => s.id !== setId) } : e,
            ),
          },
        })
      },
      updateSet: (entryId, setId, patch) => {
        const w = get().activeWorkout
        if (!w) return
        set({
          activeWorkout: {
            ...w,
            exercises: w.exercises.map((e) =>
              e.id === entryId
                ? { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)) }
                : e,
            ),
          },
        })
      },
      setSetType: (entryId, setId, type) => {
        get().updateSet(entryId, setId, { type })
      },
      toggleSetCompleted: (entryId, setId) => {
        const w = get().activeWorkout
        if (!w) return
        let justCompleted = false
        let restSeconds = 90
        const entry = w.exercises.find((e) => e.id === entryId)
        if (entry) restSeconds = entry.restSeconds
        set({
          activeWorkout: {
            ...w,
            exercises: w.exercises.map((e) =>
              e.id === entryId
                ? {
                    ...e,
                    sets: e.sets.map((s) => {
                      if (s.id !== setId) return s
                      const completed = !s.completed
                      if (completed) justCompleted = true
                      return { ...s, completed }
                    }),
                  }
                : e,
            ),
          },
        })
        if (justCompleted) {
          get().startRestTimer(restSeconds)
          const prTypes = get().getSetPRFlags(entryId, setId)
          if (prTypes.length > 0) {
            const exercise = entry ? get().getExerciseById(entry.exerciseId) : undefined
            useToastStore.getState().pushToast({
              kind: 'pr',
              title: exercise?.name ?? 'Personal Record',
              subtitle: prTypes.map((t) => PR_LABELS[t]).join(' · '),
              prTypes,
            })
            if (get().settings.soundEffectsEnabled) playCelebrationSound('pr')
          }
        }
      },
      updateEntryNotes: (entryId, notes) => {
        const w = get().activeWorkout
        if (!w) return
        set({
          activeWorkout: {
            ...w,
            exercises: w.exercises.map((e) => (e.id === entryId ? { ...e, notes } : e)),
          },
        })
      },
      updateEntryRest: (entryId, seconds) => {
        const w = get().activeWorkout
        if (!w) return
        set({
          activeWorkout: {
            ...w,
            exercises: w.exercises.map((e) => (e.id === entryId ? { ...e, restSeconds: seconds } : e)),
          },
        })
      },
      reorderActiveExercise: (entryId, direction) => {
        const w = get().activeWorkout
        if (!w) return
        const idx = w.exercises.findIndex((e) => e.id === entryId)
        if (idx === -1) return
        const swapWith = direction === 'up' ? idx - 1 : idx + 1
        if (swapWith < 0 || swapWith >= w.exercises.length) return
        const next = [...w.exercises]
        ;[next[idx], next[swapWith]] = [next[swapWith], next[idx]]
        set({ activeWorkout: { ...w, exercises: next } })
      },

      finishWorkout: (params) => {
        const w = get().activeWorkout
        if (!w) return null
        const historyBefore = get().history

        const exercises = w.exercises
          .map((e) => {
            const exercise = get().getExerciseById(e.exerciseId)
            const isDuration = exercise?.logType === 'duration' || exercise?.logType === 'distance_duration'
            const priorSets: MiniSet[] = []
            for (const log of historyBefore) {
              for (const le of log.exercises) {
                if (le.exerciseId === e.exerciseId) priorSets.push(...le.sets)
              }
            }
            const setsWithPR = e.sets
              .filter((s) => s.completed)
              .map((s) => {
                const prTypes = computePRFlags(s, priorSets, isDuration)
                priorSets.push(s)
                return { ...s, prTypes }
              })
            return { ...e, sets: setsWithPR }
          })
          .filter((e) => e.sets.length > 0)

        let totalVolume = 0
        let totalSets = 0
        const prIds: string[] = []
        for (const entry of exercises) {
          for (const st of entry.sets) {
            totalSets += 1
            if (st.weight && st.reps) totalVolume += st.weight * st.reps
            if (st.prTypes && st.prTypes.length > 0) prIds.push(entry.exerciseId)
          }
        }

        const endedAt = new Date(params.endedAt)
        const startedAt = new Date(endedAt.getTime() - params.durationSeconds * 1000)

        const log: WorkoutLog = {
          id: w.id,
          name: params.name,
          notes: params.notes,
          routineId: w.routineId,
          startedAt: startedAt.toISOString(),
          endedAt: endedAt.toISOString(),
          durationSeconds: params.durationSeconds,
          exercises,
          totalVolume,
          totalSets,
          prIds: Array.from(new Set(prIds)),
        }

        set((s) => ({
          history: [log, ...s.history],
          activeWorkout: null,
          restTimer: { running: false, endsAt: null, totalSeconds: s.settings.defaultRestTimerSec },
        }))
        get().checkAchievements()
        return log
      },

      startRestTimer: (seconds) => {
        set({ restTimer: { running: true, endsAt: Date.now() + seconds * 1000, totalSeconds: seconds } })
      },
      stopRestTimer: () =>
        set((s) => ({ restTimer: { running: false, endsAt: null, totalSeconds: s.settings.defaultRestTimerSec } })),
      adjustRestTimer: (deltaSeconds) => {
        const t = get().restTimer
        if (!t.running || !t.endsAt) return
        set({ restTimer: { ...t, endsAt: t.endsAt + deltaSeconds * 1000 } })
      },

      setUtilityTimerMode: (mode) => set((s) => ({ utilityTimer: { ...s.utilityTimer, mode } })),
      setTimerDuration: (seconds) =>
        set((s) => ({
          utilityTimer: {
            ...s.utilityTimer,
            timerTotalSeconds: seconds,
            timerRemainingSeconds: seconds,
            timerRunning: false,
            timerEndsAt: null,
          },
        })),
      startTimer: () => {
        const t = get().utilityTimer
        if (t.timerRemainingSeconds <= 0) return
        set({ utilityTimer: { ...t, timerRunning: true, timerEndsAt: Date.now() + t.timerRemainingSeconds * 1000 } })
      },
      pauseTimer: () => {
        const t = get().utilityTimer
        if (!t.timerRunning || !t.timerEndsAt) return
        const remaining = Math.max(0, Math.round((t.timerEndsAt - Date.now()) / 1000))
        set({ utilityTimer: { ...t, timerRunning: false, timerEndsAt: null, timerRemainingSeconds: remaining } })
      },
      resetTimer: () => {
        const t = get().utilityTimer
        set({ utilityTimer: { ...t, timerRunning: false, timerEndsAt: null, timerRemainingSeconds: t.timerTotalSeconds } })
      },
      completeTimer: () => {
        const t = get().utilityTimer
        if (!t.timerRunning) return
        set({ utilityTimer: { ...t, timerRunning: false, timerEndsAt: null, timerRemainingSeconds: 0 } })
        if (get().settings.soundEffectsEnabled) playTimerAlarm()
      },
      startStopwatch: () => {
        const t = get().utilityTimer
        set({ utilityTimer: { ...t, stopwatchRunning: true, stopwatchStartedAt: Date.now() - t.stopwatchElapsedSeconds * 1000 } })
      },
      pauseStopwatch: () => {
        const t = get().utilityTimer
        if (!t.stopwatchRunning || !t.stopwatchStartedAt) return
        const elapsed = (Date.now() - t.stopwatchStartedAt) / 1000
        set({ utilityTimer: { ...t, stopwatchRunning: false, stopwatchStartedAt: null, stopwatchElapsedSeconds: elapsed } })
      },
      resetStopwatch: () => {
        const t = get().utilityTimer
        set({ utilityTimer: { ...t, stopwatchRunning: false, stopwatchStartedAt: null, stopwatchElapsedSeconds: 0 } })
      },

      getLastPerformance: (exerciseId) => {
        const log = get().history.find((h) => h.exercises.some((e) => e.exerciseId === exerciseId))
        return log?.exercises.find((e) => e.exerciseId === exerciseId)
      },
      getPersonalRecordWeight: (exerciseId) => {
        let best: number | null = null
        for (const log of get().history) {
          for (const entry of log.exercises) {
            if (entry.exerciseId !== exerciseId) continue
            for (const s of entry.sets) {
              if (s.weight && (best === null || s.weight > best)) best = s.weight
            }
          }
        }
        return best
      },
      deleteWorkoutLog: (id) => set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
      updateWorkoutLog: (id, patch) =>
        set((s) => ({
          history: s.history.map((h) => {
            if (h.id !== id) return h
            const merged = { ...h, ...patch }
            if (patch.endedAt !== undefined || patch.durationSeconds !== undefined) {
              const endedAt = new Date(merged.endedAt)
              merged.startedAt = new Date(endedAt.getTime() - merged.durationSeconds * 1000).toISOString()
            }
            return merged
          }),
        })),

      getSetPRFlags: (entryId, setId) => {
        const w = get().activeWorkout
        if (!w) return []
        const entry = w.exercises.find((e) => e.id === entryId)
        if (!entry) return []
        const idx = entry.sets.findIndex((s) => s.id === setId)
        const target = entry.sets[idx]
        if (!target || !target.completed) return []
        const exercise = get().getExerciseById(entry.exerciseId)
        const isDuration = exercise?.logType === 'duration' || exercise?.logType === 'distance_duration'

        const priorSets: MiniSet[] = []
        for (const log of get().history) {
          for (const le of log.exercises) {
            if (le.exerciseId === entry.exerciseId) priorSets.push(...le.sets)
          }
        }
        for (const s of entry.sets.slice(0, idx)) {
          if (s.completed) priorSets.push(s)
        }
        return computePRFlags(target, priorSets, isDuration)
      },
      getExerciseBests: (exerciseId) => {
        let maxWeight: number | null = null
        let maxReps: number | null = null
        let maxDuration: number | null = null
        for (const log of get().history) {
          for (const entry of log.exercises) {
            if (entry.exerciseId !== exerciseId) continue
            for (const s of entry.sets) {
              if (s.weight != null && (maxWeight === null || s.weight > maxWeight)) maxWeight = s.weight
              if (s.reps != null && (maxReps === null || s.reps > maxReps)) maxReps = s.reps
              if (s.durationSeconds != null && (maxDuration === null || s.durationSeconds > maxDuration)) maxDuration = s.durationSeconds
            }
          }
        }
        return { maxWeight, maxReps, maxDuration }
      },

      logClimb: ({ type, grade, styleTags, attempts, isSend, timestampMs }) => {
        const climb: ClimbEntry = {
          id: nanoid(8),
          type,
          grade,
          styleTags,
          attempts,
          isSend,
          timestampMs,
          location: 'Local Gym',
        }
        set((s) => ({ climbs: [climb, ...s.climbs] }))
        get().checkAchievements()
      },
      deleteClimb: (id) => set((s) => ({ climbs: s.climbs.filter((c) => c.id !== id) })),
      getClimbingStats: () => {
        const climbs = get().climbs.filter((c) => c.isSend)
        let highestBoulderIdx = -1
        let highestSportIdx = -1
        for (const c of climbs) {
          if (c.type === 'Bouldering') highestBoulderIdx = Math.max(highestBoulderIdx, boulderGradeIndex(c.grade))
          else highestSportIdx = Math.max(highestSportIdx, sportGradeIndex(c.grade))
        }
        const sessionDays = new Set(get().climbs.map((c) => new Date(c.timestampMs).toDateString()))
        const avgClimbsPerSession = sessionDays.size > 0 ? get().climbs.length / sessionDays.size : 0
        return {
          highestBoulderGrade: highestBoulderIdx >= 0 ? BOULDER_GRADES[highestBoulderIdx] : '-',
          highestSportGrade: highestSportIdx >= 0 ? SPORT_GRADES[highestSportIdx] : '-',
          avgClimbsPerSession,
        }
      },

      createMobilityRoutine: (title, description, durationMinutes) => {
        const routine: MobilityRoutine = {
          id: nanoid(8),
          title,
          description,
          durationMinutes,
          isAiGenerated: false,
          isCustom: true,
          exercises: [
            { name: 'Deep Breathing Warmup', durationSeconds: 60, targetArea: 'General' },
            { name: 'Targeted Stretch', durationSeconds: 180, targetArea: 'Primary Limiter' },
          ],
        }
        set((s) => ({ mobilityRoutines: [routine, ...s.mobilityRoutines] }))
        return routine
      },
      updateMobilityRoutine: (id, patch) => {
        set((s) => ({
          mobilityRoutines: s.mobilityRoutines.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        }))
      },
      deleteMobilityRoutine: (id) => set((s) => ({ mobilityRoutines: s.mobilityRoutines.filter((r) => r.id !== id) })),
      logMobilitySession: (routine, durationSeconds) => {
        const log: MobilityLog = {
          id: nanoid(8),
          routineId: routine.id,
          routineTitle: routine.title,
          completedAt: new Date().toISOString(),
          durationSeconds,
          exercisesDone: routine.exercises.map((e) => e.name),
        }
        set((s) => ({ mobilityLogs: [log, ...s.mobilityLogs] }))
        get().checkAchievements()
      },
      completeAssessment: (scores) => set({ bodyAreaScores: scores, assessmentCompletedAt: new Date().toISOString() }),

      updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      getCombinedStats: () => {
        const s = get()
        const prCount = s.history.reduce((n, log) => n + log.prIds.length, 0)
        const totalVolumeKg = s.history.reduce((n, log) => n + log.totalVolume, 0)
        const climbing = s.getClimbingStats()
        const totalMobilityMinutes = Math.round(s.mobilityLogs.reduce((n, l) => n + l.durationSeconds, 0) / 60)
        const weakestArea = [...s.bodyAreaScores].sort((a, b) => a.scorePercentage - b.scorePercentage)[0]
        return {
          workoutCount: s.history.length,
          totalVolumeKg,
          prCount,
          totalClimbs: s.climbs.length,
          highestBoulder: climbing.highestBoulderGrade,
          highestSport: climbing.highestSportGrade,
          mobilitySessions: s.mobilityLogs.length,
          totalMobilityMinutes,
          topAreaFocus: weakestArea?.areaName ?? '-',
        }
      },
      getDailyActivity: (metric, days) => {
        const s = get()
        const points: DailyActivityPoint[] = []
        const now = new Date()
        for (let i = days - 1; i >= 0; i--) {
          const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
          const dayStart = day.getTime()
          const dayEnd = dayStart + 86400000
          let value = 0
          if (metric === 'duration') {
            value = s.history
              .filter((l) => new Date(l.endedAt).getTime() >= dayStart && new Date(l.endedAt).getTime() < dayEnd)
              .reduce((n, l) => n + l.durationSeconds, 0) / 60
          } else if (metric === 'volume') {
            value = s.history
              .filter((l) => new Date(l.endedAt).getTime() >= dayStart && new Date(l.endedAt).getTime() < dayEnd)
              .reduce((n, l) => n + l.totalVolume, 0)
          } else if (metric === 'reps') {
            value = s.history
              .filter((l) => new Date(l.endedAt).getTime() >= dayStart && new Date(l.endedAt).getTime() < dayEnd)
              .reduce((n, l) => n + l.exercises.reduce((m, e) => m + e.sets.reduce((k, st) => k + (st.reps ?? 0), 0), 0), 0)
          } else if (metric === 'climbing') {
            value = s.climbs.filter((c) => c.timestampMs >= dayStart && c.timestampMs < dayEnd).length
          } else if (metric === 'mobility') {
            value = s.mobilityLogs
              .filter((l) => new Date(l.completedAt).getTime() >= dayStart && new Date(l.completedAt).getTime() < dayEnd)
              .reduce((n, l) => n + l.durationSeconds, 0) / 60
          }
          points.push({ dayLabel: day.toLocaleDateString(undefined, { weekday: 'short' }), dateMs: dayStart, value: Math.round(value) })
        }
        return points
      },

      getActivityStreak: () => {
        const s = get()
        const dayKey = (ms: number) => new Date(ms).toDateString()
        const days = new Set<string>()
        for (const log of s.history) days.add(dayKey(new Date(log.endedAt).getTime()))
        for (const c of s.climbs) days.add(dayKey(c.timestampMs))
        for (const m of s.mobilityLogs) days.add(dayKey(new Date(m.completedAt).getTime()))

        if (days.size === 0) return { current: 0, longest: 0 }

        const todayStart = new Date().setHours(0, 0, 0, 0)
        let current = 0
        let cursor = todayStart
        if (!days.has(new Date(cursor).toDateString())) cursor -= DAY_MS
        while (days.has(new Date(cursor).toDateString())) {
          current += 1
          cursor -= DAY_MS
        }

        const sortedDayMs = Array.from(days)
          .map((d) => new Date(d).getTime())
          .sort((a, b) => a - b)
        let longest = 0
        let run = 0
        let prev: number | null = null
        for (const d of sortedDayMs) {
          run = prev !== null && d - prev === DAY_MS ? run + 1 : 1
          longest = Math.max(longest, run)
          prev = d
        }

        return { current, longest: Math.max(longest, current) }
      },
      checkAchievements: () => {
        const s = get()
        const streak = s.getActivityStreak()
        const workoutCount = s.history.length
        const prCount = s.history.reduce((n, log) => n + log.prIds.length, 0)

        const newlyUnlocked = ACHIEVEMENTS.filter((def) => {
          if (s.achievements[def.id]) return false
          if (def.category === 'streak') return streak.current >= def.threshold
          if (def.category === 'workouts') return workoutCount >= def.threshold
          return prCount >= def.threshold
        })
        if (newlyUnlocked.length === 0) return

        const unlockedAt = new Date().toISOString()
        set((st) => ({
          achievements: {
            ...st.achievements,
            ...Object.fromEntries(newlyUnlocked.map((def) => [def.id, unlockedAt])),
          },
        }))

        for (const def of newlyUnlocked) {
          useToastStore.getState().pushToast({
            kind: 'achievement',
            title: def.title,
            subtitle: def.description,
            category: def.category,
          })
        }
        if (get().settings.soundEffectsEnabled) playCelebrationSound('achievement')
      },

      loadDemoData: () => {
        const demo = buildDemoData(Date.now())
        set((s) => ({
          folders: [...s.folders, ...demo.folders],
          routines: [...s.routines, ...demo.routines],
          history: [...s.history, ...demo.history].sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime()),
          climbs: [...s.climbs, ...demo.climbs].sort((a, b) => b.timestampMs - a.timestampMs),
          mobilityRoutines: [...s.mobilityRoutines, ...demo.mobilityRoutines],
          mobilityLogs: [...s.mobilityLogs, ...demo.mobilityLogs].sort(
            (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
          ),
          profile: { ...s.profile, username: 'Alex Rivera', bio: 'Training for strength, climbing for fun.', avatarColorIndex: 1 },
        }))
        get().checkAchievements()
      },
    }),
    { name: 'reppy-workout-store' },
  ),
)
