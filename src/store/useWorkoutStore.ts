import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type {
  ActiveWorkoutSession,
  Exercise,
  Routine,
  SetType,
  WorkoutExerciseEntry,
  WorkoutLog,
  WorkoutSet,
} from '../types'
import { EXERCISE_LIBRARY } from '../data/exercises'

interface RestTimerState {
  running: boolean
  endsAt: number | null
  totalSeconds: number
}

interface WorkoutStore {
  customExercises: Exercise[]
  routines: Routine[]
  history: WorkoutLog[]
  activeWorkout: ActiveWorkoutSession | null
  restTimer: RestTimerState

  // exercise library
  addCustomExercise: (e: Omit<Exercise, 'id' | 'isCustom'>) => Exercise
  getAllExercises: () => Exercise[]
  getExerciseById: (id: string) => Exercise | undefined

  // routines
  createRoutine: (name: string) => Routine
  updateRoutine: (routine: Routine) => void
  deleteRoutine: (id: string) => void
  duplicateRoutine: (id: string) => void

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
  finishWorkout: (name: string) => WorkoutLog | null
  renameActiveWorkout: (name: string) => void

  // rest timer
  startRestTimer: (seconds: number) => void
  stopRestTimer: () => void
  adjustRestTimer: (deltaSeconds: number) => void

  // history helpers
  getLastPerformance: (exerciseId: string) => WorkoutExerciseEntry | undefined
  getPersonalRecordWeight: (exerciseId: string) => number | null
  deleteWorkoutLog: (id: string) => void
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

function makeEntry(exerciseId: string, previous?: WorkoutExerciseEntry): WorkoutExerciseEntry {
  return {
    id: nanoid(8),
    exerciseId,
    notes: '',
    restSeconds: 90,
    supersetGroup: null,
    sets: previous
      ? previous.sets.map((s) => emptySet(s))
      : [emptySet(), emptySet(), emptySet()],
  }
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      customExercises: [],
      routines: [],
      history: [],
      activeWorkout: null,
      restTimer: { running: false, endsAt: null, totalSeconds: 90 },

      addCustomExercise: (e) => {
        const exercise: Exercise = { ...e, id: `custom-${nanoid(8)}`, isCustom: true }
        set((s) => ({ customExercises: [...s.customExercises, exercise] }))
        return exercise
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
              return makeEntry(e.exerciseId, last)
            }),
          },
        })
      },
      cancelActiveWorkout: () => set({ activeWorkout: null, restTimer: { running: false, endsAt: null, totalSeconds: 90 } }),
      renameActiveWorkout: (name) => {
        const w = get().activeWorkout
        if (!w) return
        set({ activeWorkout: { ...w, name } })
      },
      addExerciseToActive: (exerciseId) => {
        const w = get().activeWorkout
        if (!w) return
        const last = get().getLastPerformance(exerciseId)
        set({ activeWorkout: { ...w, exercises: [...w.exercises, makeEntry(exerciseId, last)] } })
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
        if (justCompleted) get().startRestTimer(restSeconds)
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

      finishWorkout: (name) => {
        const w = get().activeWorkout
        if (!w) return null
        const startedAt = new Date(w.startedAt)
        const endedAt = new Date()
        const exercises = w.exercises
          .map((e) => ({ ...e, sets: e.sets.filter((s) => s.completed) }))
          .filter((e) => e.sets.length > 0)

        let totalVolume = 0
        let totalSets = 0
        const prIds: string[] = []
        for (const entry of exercises) {
          const prevBest = get().getPersonalRecordWeight(entry.exerciseId) ?? 0
          for (const st of entry.sets) {
            totalSets += 1
            if (st.weight && st.reps) totalVolume += st.weight * st.reps
            if (st.weight && st.weight > prevBest) prIds.push(entry.exerciseId)
          }
        }

        const log: WorkoutLog = {
          id: w.id,
          name,
          routineId: w.routineId,
          startedAt: w.startedAt,
          endedAt: endedAt.toISOString(),
          durationSeconds: Math.max(0, Math.round((endedAt.getTime() - startedAt.getTime()) / 1000)),
          exercises,
          totalVolume,
          totalSets,
          prIds: Array.from(new Set(prIds)),
        }

        set((s) => ({
          history: [log, ...s.history],
          activeWorkout: null,
          restTimer: { running: false, endsAt: null, totalSeconds: 90 },
        }))
        return log
      },

      startRestTimer: (seconds) => {
        set({ restTimer: { running: true, endsAt: Date.now() + seconds * 1000, totalSeconds: seconds } })
      },
      stopRestTimer: () => set({ restTimer: { running: false, endsAt: null, totalSeconds: 90 } }),
      adjustRestTimer: (deltaSeconds) => {
        const t = get().restTimer
        if (!t.running || !t.endsAt) return
        set({ restTimer: { ...t, endsAt: t.endsAt + deltaSeconds * 1000 } })
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
    }),
    { name: 'reppy-workout-store' },
  ),
)
