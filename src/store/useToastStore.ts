import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { AchievementCategory, PRType } from '../types'

export type ToastKind = 'pr' | 'achievement'

export interface ToastItem {
  id: string
  kind: ToastKind
  title: string
  subtitle: string
  prTypes?: PRType[]
  category?: AchievementCategory
}

interface ToastStore {
  toasts: ToastItem[]
  pushToast: (toast: Omit<ToastItem, 'id'>) => void
  dismissToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  pushToast: (toast) => {
    const id = nanoid(8)
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 6000)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
