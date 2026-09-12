import { STRETCH_LIBRARY, STRETCH_TARGET_AREAS, TOP_PICK_STRETCH_IDS } from '../data/stretches'
import type { BodyAreaScore, DailyMobilityPlan, MobilityStretch, Stretch } from '../types'

/**
 * Maps a mobility-assessment area name to the stretch-library target areas
 * that address it. The assessment currently reports six areas (Hips,
 * Shoulders, Overhead, Ankles, Hamstrings, Lower Back); add an entry here
 * whenever a future assessment introduces a new area name. An area with no
 * entry falls back to treating its own name as a stretch target area, so a
 * new assessment area that already matches one (e.g. "Calves") works with
 * zero changes here.
 */
const ASSESSMENT_AREA_TO_STRETCH_AREAS: Record<string, string[]> = {
  Hips: ['Hip Flexors', 'Glutes', 'Adductors', 'Abductors'],
  Shoulders: ['Shoulders', 'Chest'],
  Overhead: ['Shoulders', 'Lats', 'Upper Back'],
  Ankles: ['Ankles', 'Calves'],
  Hamstrings: ['Hamstrings'],
  'Lower Back': ['Lower Back', 'Abs', 'Obliques'],
}

const FOCUS_AREA_COUNT = 3
const FOCUS_STRETCH_COUNT = 5
const MAINTENANCE_STRETCH_COUNT = 2

function daysSince(iso: string | undefined): number {
  if (!iso) return Infinity
  return Math.max(0, (Date.now() - new Date(iso).getTime()) / 86_400_000)
}

/** Higher weight = more likely to be picked: top picks favored, recently-used stretches damped. */
function weightOf(stretch: Stretch, usageLog: Record<string, string>): number {
  const base = TOP_PICK_STRETCH_IDS.has(stretch.id) ? 3 : 1
  const recency = Math.min(1, daysSince(usageLog[stretch.id]) / 6)
  return base * Math.max(0.12, recency)
}

function weightedPick(candidates: Stretch[], usageLog: Record<string, string>): Stretch | null {
  if (candidates.length === 0) return null
  const weights = candidates.map((s) => weightOf(s, usageLog))
  const total = weights.reduce((n, w) => n + w, 0)
  let roll = Math.random() * total
  for (let i = 0; i < candidates.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return candidates[i]
  }
  return candidates[candidates.length - 1]
}

function stretchAreaPool(targetArea: string, exclude: Set<string>): Stretch[] {
  return STRETCH_LIBRARY.filter((s) => s.targetArea === targetArea && !exclude.has(s.id))
}

/** Picks a single replacement stretch from the same target area, used for both plan generation and manual substitution. */
export function pickReplacementStretch(
  targetArea: string,
  exclude: Set<string>,
  usageLog: Record<string, string>,
): Stretch | null {
  return weightedPick(stretchAreaPool(targetArea, exclude), usageLog)
}

export function toMobilityStretch(s: Stretch): MobilityStretch {
  return { name: s.name, durationSeconds: s.defaultDurationSeconds, targetArea: s.targetArea }
}

export function generateDailyMobilityPlan(
  bodyAreaScores: BodyAreaScore[],
  excludedStretchIds: string[],
  usageLog: Record<string, string>,
): DailyMobilityPlan {
  const exclude = new Set(excludedStretchIds)
  const picked: Stretch[] = []
  const pickedIds = new Set<string>()

  function take(area: string) {
    const s = pickReplacementStretch(area, new Set([...exclude, ...pickedIds]), usageLog)
    if (s) {
      picked.push(s)
      pickedIds.add(s.id)
    }
    return s
  }

  const focusAreas = [...bodyAreaScores]
    .sort((a, b) => a.scorePercentage - b.scorePercentage)
    .slice(0, FOCUS_AREA_COUNT)
    .map((s) => s.areaName)

  const focusStretchAreas = Array.from(
    new Set(focusAreas.flatMap((a) => ASSESSMENT_AREA_TO_STRETCH_AREAS[a] ?? [a])),
  )
  const maintenanceStretchAreas = STRETCH_TARGET_AREAS.filter((a) => !focusStretchAreas.includes(a))

  // Spread focus slots across focus areas, cycling back through them if there are fewer areas than slots.
  for (let i = 0; i < FOCUS_STRETCH_COUNT && focusStretchAreas.length > 0; i++) {
    take(focusStretchAreas[i % focusStretchAreas.length])
  }
  for (let i = 0; i < MAINTENANCE_STRETCH_COUNT && maintenanceStretchAreas.length > 0; i++) {
    take(maintenanceStretchAreas[i % maintenanceStretchAreas.length])
  }

  // Guarantee at least one active (movement) stretch, preferring a focus area.
  if (!picked.some((s) => s.type === 'active')) {
    const activePool = STRETCH_LIBRARY.filter(
      (s) => s.type === 'active' && !exclude.has(s.id) && !pickedIds.has(s.id),
    )
    const focusActive = activePool.filter((s) => focusStretchAreas.includes(s.targetArea))
    const chosen = weightedPick(focusActive.length > 0 ? focusActive : activePool, usageLog)
    if (chosen) {
      picked.push(chosen)
      pickedIds.add(chosen.id)
    }
  }

  // Guarantee one massage-gun stretch, preferring a focus area.
  if (!picked.some((s) => s.equipment === 'Massage Gun')) {
    const gunPool = STRETCH_LIBRARY.filter(
      (s) => s.equipment === 'Massage Gun' && !exclude.has(s.id) && !pickedIds.has(s.id),
    )
    const focusGun = gunPool.filter((s) => focusStretchAreas.includes(s.targetArea))
    const chosen = weightedPick(focusGun.length > 0 ? focusGun : gunPool, usageLog)
    if (chosen) {
      picked.push(chosen)
      pickedIds.add(chosen.id)
    }
  }

  return {
    date: new Date().toISOString().slice(0, 10),
    focusAreas,
    exercises: picked.map(toMobilityStretch),
  }
}
