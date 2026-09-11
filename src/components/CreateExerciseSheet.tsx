import { useEffect, useState } from 'react'
import Sheet from './Sheet'
import { EQUIPMENT_TYPES, MUSCLE_GROUPS } from '../data/exercises'
import type { Equipment, Exercise, ExerciseLogType, MuscleGroup } from '../types'

export default function CreateExerciseSheet({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean
  onClose: () => void
  onSave: (payload: Omit<Exercise, 'id' | 'isCustom'>) => void
  /** Pass an existing exercise to edit it in place; omit to create a new one. */
  initial?: Exercise
}) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<MuscleGroup>('Chest')
  const [equipment, setEquipment] = useState<Equipment>('Barbell')
  const [logType, setLogType] = useState<ExerciseLogType>('weight_reps')

  useEffect(() => {
    if (!open) return
    setName(initial?.name ?? '')
    setCategory(initial?.category ?? 'Chest')
    setEquipment(initial?.equipment ?? 'Barbell')
    setLogType(initial?.logType ?? 'weight_reps')
  }, [open, initial])

  function submit() {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      category,
      equipment,
      logType,
      secondaryMuscles: initial?.secondaryMuscles ?? [],
      instructions: initial?.instructions ?? [],
    })
    if (!initial) setName('')
  }

  return (
    <Sheet open={open} onClose={onClose} title={initial ? 'Edit Exercise' : 'Create Exercise'}>
      <div className="space-y-4 p-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-white/50">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cable Pullover"
            className="w-full rounded-lg bg-surface-higher px-3 py-2.5 text-sm outline-none placeholder:text-white/30"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-white/50">Primary Muscle</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MuscleGroup)}
            className="w-full rounded-lg bg-surface-higher px-3 py-2.5 text-sm outline-none"
          >
            {MUSCLE_GROUPS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-white/50">Equipment</label>
          <select
            value={equipment}
            onChange={(e) => setEquipment(e.target.value as Equipment)}
            className="w-full rounded-lg bg-surface-higher px-3 py-2.5 text-sm outline-none"
          >
            {EQUIPMENT_TYPES.map((eq) => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-white/50">Tracking Type</label>
          <select
            value={logType}
            onChange={(e) => setLogType(e.target.value as ExerciseLogType)}
            className="w-full rounded-lg bg-surface-higher px-3 py-2.5 text-sm outline-none"
          >
            <option value="weight_reps">Weight & Reps</option>
            <option value="bodyweight_reps">Bodyweight Reps</option>
            <option value="weighted_bodyweight">Weighted Bodyweight</option>
            <option value="duration">Duration</option>
            <option value="distance_duration">Distance & Duration</option>
            <option value="reps_only">Reps Only</option>
          </select>
        </div>
        <button onClick={submit} disabled={!name.trim()} className="w-full rounded-xl bg-accent py-3 text-sm font-bold disabled:opacity-40">
          {initial ? 'Save Changes' : 'Create Exercise'}
        </button>
      </div>
    </Sheet>
  )
}
