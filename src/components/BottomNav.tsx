import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, ListTree, User, Mountain, Sparkles } from 'lucide-react'

const tabs = [
  { to: '/home', label: 'Home', icon: Home, color: '#0C7CFF' },
  { to: '/workout', label: 'Workout', icon: Dumbbell, color: '#0C7CFF' },
  { to: '/climbing', label: 'Climbing', icon: Mountain, color: '#FB923C' },
  { to: '/mobility', label: 'Mobility', icon: Sparkles, color: '#34D399' },
  { to: '/exercises', label: 'Exercises', icon: ListTree, color: '#0C7CFF' },
  { to: '/profile', label: 'Profile', icon: User, color: '#0C7CFF' },
]

export default function BottomNav() {
  return (
    <nav className="grid shrink-0 grid-cols-6 border-t border-surface-border bg-surface-raised pb-6 pt-2">
      {tabs.map(({ to, label, icon: Icon, color }) => (
        <NavLink
          key={to}
          to={to}
          className="flex flex-col items-center gap-1 py-1 text-[9px] font-medium text-white/40"
        >
          {({ isActive }) => (
            <>
              <Icon size={19} strokeWidth={isActive ? 2.4 : 2} color={isActive ? color : undefined} />
              <span style={isActive ? { color } : undefined}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
