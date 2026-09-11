import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import StatusBar from './components/StatusBar'
import RestTimerBar from './components/RestTimerBar'
import WorkoutHome from './pages/WorkoutHome'
import RoutineEditor from './pages/RoutineEditor'
import ActiveWorkout from './pages/ActiveWorkout'
import ExerciseLibrary from './pages/ExerciseLibrary'
import ExerciseDetail from './pages/ExerciseDetail'
import WorkoutSummary from './pages/WorkoutSummary'
import History from './pages/History'
import Home from './pages/Home'
import Climbing from './pages/Climbing'
import Mobility from './pages/Mobility'
import Profile from './pages/Profile'
import ToastContainer from './components/ToastContainer'
import { useWorkoutStore } from './store/useWorkoutStore'

function ScreenChrome() {
  const location = useLocation()
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout)
  const isActiveWorkoutScreen = location.pathname === '/workout/active'
  const showBottomNav = !isActiveWorkoutScreen

  return (
    <div className="flex h-full flex-col bg-surface text-white">
      <StatusBar />
      <div className="relative flex-1 overflow-hidden">
        <div className="no-scrollbar h-full overflow-y-auto pb-4">
          <Routes>
            <Route path="/" element={<Navigate to="/workout" replace />} />
            <Route path="/workout" element={<WorkoutHome />} />
            <Route path="/workout/routine/new" element={<RoutineEditor mode="create" />} />
            <Route path="/workout/routine/:routineId" element={<RoutineEditor mode="edit" />} />
            <Route path="/workout/active" element={<ActiveWorkout />} />
            <Route path="/workout/summary/:logId" element={<WorkoutSummary />} />
            <Route path="/workout/history" element={<History />} />
            <Route path="/exercises" element={<ExerciseLibrary mode="browse" />} />
            <Route path="/exercises/:exerciseId" element={<ExerciseDetail />} />
            <Route path="/home" element={<Home />} />
            <Route path="/climbing" element={<Climbing />} />
            <Route path="/mobility" element={<Mobility />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/workout" replace />} />
          </Routes>
        </div>
        {!isActiveWorkoutScreen && activeWorkout && <ResumeWorkoutBar />}
        {isActiveWorkoutScreen && <RestTimerBar />}
        <ToastContainer />
      </div>
      {showBottomNav && <BottomNav />}
    </div>
  )
}

function ResumeWorkoutBar() {
  return (
    <a
      href="#/workout/active"
      className="absolute inset-x-2 bottom-2 z-20 flex items-center justify-between rounded-xl bg-accent px-4 py-3 text-sm font-semibold shadow-lg shadow-accent/30 animate-slide-up"
    >
      <span>Resume workout</span>
      <span className="text-xs opacity-90">Tap to continue →</span>
    </a>
  )
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#05060a] p-4 sm:p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-[812px] w-[375px] max-h-[88vh] max-w-[92vw] overflow-hidden rounded-[3rem] border-[10px] border-black bg-black shadow-2xl ring-1 ring-white/10">
          <div className="pointer-events-none absolute left-1/2 top-0 z-30 h-6 w-36 -translate-x-1/2 rounded-b-2xl bg-black" />
          <div className="h-full w-full overflow-hidden rounded-[2.3rem]">{children}</div>
        </div>
        <p className="text-xs tracking-wide text-white/30">Reppy — Workout Tab Emulator</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <PhoneFrame>
      <ScreenChrome />
    </PhoneFrame>
  )
}
