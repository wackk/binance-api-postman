import type { AchievementCategory } from '../types'

export interface AchievementDef {
  id: string
  title: string
  description: string
  category: AchievementCategory
  threshold: number
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'streak_3', title: '3-Day Streak', description: 'Logged activity 3 days in a row', category: 'streak', threshold: 3 },
  { id: 'streak_7', title: '7-Day Streak', description: 'Logged activity 7 days in a row', category: 'streak', threshold: 7 },
  { id: 'streak_14', title: '14-Day Streak', description: 'Logged activity 14 days in a row', category: 'streak', threshold: 14 },
  { id: 'streak_30', title: '30-Day Streak', description: 'Logged activity 30 days in a row', category: 'streak', threshold: 30 },
  { id: 'streak_100', title: '100-Day Streak', description: 'Logged activity 100 days in a row', category: 'streak', threshold: 100 },
  { id: 'workouts_1', title: 'First Workout', description: 'Completed your first workout', category: 'workouts', threshold: 1 },
  { id: 'workouts_10', title: '10 Workouts', description: 'Completed 10 workouts', category: 'workouts', threshold: 10 },
  { id: 'workouts_25', title: '25 Workouts', description: 'Completed 25 workouts', category: 'workouts', threshold: 25 },
  { id: 'workouts_50', title: '50 Workouts', description: 'Completed 50 workouts', category: 'workouts', threshold: 50 },
  { id: 'workouts_100', title: '100 Workouts', description: 'Completed 100 workouts', category: 'workouts', threshold: 100 },
  { id: 'prs_1', title: 'First PR', description: 'Set your first personal record', category: 'prs', threshold: 1 },
  { id: 'prs_10', title: '10 PRs', description: 'Set 10 personal records', category: 'prs', threshold: 10 },
  { id: 'prs_25', title: '25 PRs', description: 'Set 25 personal records', category: 'prs', threshold: 25 },
  { id: 'prs_50', title: '50 PRs', description: 'Set 50 personal records', category: 'prs', threshold: 50 },
]
