export const CLIMBING_STYLE_TAGS = [
  'Dynamic', 'Technical', 'Pumpy', 'Slab', 'Overhang',
  'Crimps', 'Pinches', 'Slopers', 'Pockets', 'Drop Knee',
  'Heel Hook', 'Crack', 'Volumes', 'Power',
]

export const BOULDER_GRADES = ['VB', 'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12+']
export const SPORT_GRADES = [
  '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d',
  '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d', '5.13a+',
]

export function boulderGradeIndex(grade: string): number {
  const idx = BOULDER_GRADES.indexOf(grade)
  return idx >= 0 ? idx : 0
}

export function sportGradeIndex(grade: string): number {
  const idx = SPORT_GRADES.indexOf(grade)
  return idx >= 0 ? idx : 0
}
