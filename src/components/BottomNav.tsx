import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, ListTree, User } from 'lucide-react'

const tabs = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/workout', label: 'Workout', icon: Dumbbell },
  { to: '/exercises', label: 'Exercises', icon: ListTree },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function BottomNav() {
  return (
    <nav className="grid shrink-0 grid-cols-4 border-t border-surface-border bg-surface-raised pb-6 pt-2">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-accent' : 'text-white/40'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
