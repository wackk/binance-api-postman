import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Pencil,
  Settings as SettingsIcon,
  User,
  Dumbbell,
  Mountain,
  Sparkles,
  LineChart,
  ListTree,
  Ruler,
  CalendarDays,
  Flame,
} from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import type { ActivityMetric } from '../store/useWorkoutStore'
import Sheet from '../components/Sheet'
import { MiniBarChart } from '../components/charts'
import { CATEGORY_META } from '../components/ToastContainer'
import { ACHIEVEMENTS } from '../data/achievements'
import { formatVolume } from '../lib/format'
import { useDragScroll } from '../lib/useDragScroll'

const AVATAR_COLORS = ['#0088FF', '#9C27B0', '#FF9800', '#00E676', '#FF1744']

const METRIC_OPTIONS: { key: ActivityMetric; label: string; color: string; suffix: string }[] = [
  { key: 'duration', label: 'Duration', color: '#0088FF', suffix: 'm' },
  { key: 'volume', label: 'Volume', color: '#0C7CFF', suffix: 'kg' },
  { key: 'reps', label: 'Reps', color: '#FF9F0A', suffix: '' },
  { key: 'climbing', label: 'Climbing', color: '#FB923C', suffix: '' },
  { key: 'mobility', label: 'Mobility', color: '#34D399', suffix: 'm' },
]

export default function Profile() {
  const navigate = useNavigate()
  const profile = useWorkoutStore((s) => s.profile)
  const settings = useWorkoutStore((s) => s.settings)
  const updateProfile = useWorkoutStore((s) => s.updateProfile)
  const updateSettings = useWorkoutStore((s) => s.updateSettings)
  const getCombinedStats = useWorkoutStore((s) => s.getCombinedStats)
  const getDailyActivity = useWorkoutStore((s) => s.getDailyActivity)
  const loadDemoData = useWorkoutStore((s) => s.loadDemoData)
  const achievements = useWorkoutStore((s) => s.achievements)
  const getActivityStreak = useWorkoutStore((s) => s.getActivityStreak)

  const [editOpen, setEditOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [metric, setMetric] = useState<ActivityMetric>('duration')
  const [comingSoon, setComingSoon] = useState<string | null>(null)
  const metricScrollRef = useDragScroll<HTMLDivElement>()

  const stats = getCombinedStats()
  const metricInfo = METRIC_OPTIONS.find((m) => m.key === metric)!
  const chartData = getDailyActivity(metric, 7).map((p) => ({ label: p.dayLabel, value: p.value }))
  const avatarColor = AVATAR_COLORS[profile.avatarColorIndex] ?? AVATAR_COLORS[0]
  const streak = getActivityStreak()

  return (
    <div className="px-4 pb-8 pt-2">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold">{profile.username}</h1>
        <div className="flex gap-1">
          <button onClick={() => setEditOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised text-white/70">
            <Pencil size={15} />
          </button>
          <button onClick={() => setSettingsOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised text-white/70">
            <SettingsIcon size={16} />
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2"
          style={{ backgroundColor: avatarColor + '30', borderColor: avatarColor }}
        >
          <User size={38} style={{ color: avatarColor }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-base font-bold">{profile.username}</p>
            <span className="rounded bg-surface-higher px-1.5 py-0.5 text-[10px] text-white/40">{profile.sex}</span>
          </div>
          {profile.bio && <p className="mt-0.5 text-xs text-white/50">{profile.bio}</p>}
          <div className="mt-2 flex gap-5">
            <MetricCol label="Workouts" value={String(stats.workoutCount)} />
            <MetricCol label="Climbs" value={String(stats.totalClimbs)} />
            <MetricCol label="Mobility" value={String(stats.mobilitySessions)} />
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-surface-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold">Activity — Last 7 Days</p>
        </div>
        <div ref={metricScrollRef} className="no-scrollbar mb-3 flex cursor-grab select-none gap-2 overflow-x-auto active:cursor-grabbing">
          {METRIC_OPTIONS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                metric === m.key ? 'text-white' : 'bg-surface-higher text-white/50'
              }`}
              style={metric === m.key ? { backgroundColor: m.color } : undefined}
            >
              {m.label}
            </button>
          ))}
        </div>
        <MiniBarChart data={chartData} color={metricInfo.color} unitSuffix={metricInfo.suffix} height={130} />
      </div>

      <div className="mb-4 rounded-xl bg-surface-raised p-4">
        <p className="mb-3 text-sm font-bold">Training & Performance Overview</p>
        <div className="space-y-2.5">
          <CategoryRow
            icon={<Dumbbell size={18} />}
            color="#0C7CFF"
            title="Workouts"
            details={[
              ['Workouts', String(stats.workoutCount)],
              ['Volume', `${formatVolume(stats.totalVolumeKg)} ${settings.weightUnit}`],
              ['PRs', String(stats.prCount)],
            ]}
          />
          <CategoryRow
            icon={<Mountain size={18} />}
            color="#FB923C"
            title="Climbing"
            details={[
              ['Climbs', String(stats.totalClimbs)],
              ['Max Boulder', stats.highestBoulder],
              ['Max Sport', stats.highestSport],
            ]}
          />
          <CategoryRow
            icon={<Sparkles size={18} />}
            color="#34D399"
            title="Mobility"
            details={[
              ['Sessions', String(stats.mobilitySessions)],
              ['Minutes', `${stats.totalMobilityMinutes}m`],
              ['Focus Area', stats.topAreaFocus],
            ]}
          />
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-surface-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold">Achievements</p>
          <div className="flex items-center gap-1 text-orange-400">
            <Flame size={14} />
            <span className="text-xs font-bold">{streak.current} day streak</span>
          </div>
        </div>
        {streak.longest > streak.current && (
          <p className="mb-3 text-[10px] text-white/40">Longest streak: {streak.longest} days</p>
        )}
        <div className="grid grid-cols-3 gap-2">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = !!achievements[a.id]
            const meta = CATEGORY_META[a.category]
            const Icon = meta.icon
            return (
              <div
                key={a.id}
                className={`flex flex-col items-center gap-1 rounded-lg p-2.5 text-center ${unlocked ? '' : 'opacity-30'}`}
                style={{ backgroundColor: unlocked ? meta.color + '1A' : 'transparent' }}
                title={a.description}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: meta.color + '26' }}>
                  <Icon size={16} style={{ color: meta.color }} />
                </span>
                <p className="text-[10px] font-bold leading-tight">{a.title}</p>
              </div>
            )
          })}
        </div>
      </div>

      <p className="mb-2 text-sm font-bold">Dashboard</p>
      <div className="mb-3 grid grid-cols-2 gap-2.5">
        <DashboardButton icon={<LineChart size={20} />} label="Statistics" onClick={() => setComingSoon('Statistics')} />
        <DashboardButton icon={<ListTree size={20} />} label="Exercises" onClick={() => navigate('/exercises')} />
        <DashboardButton icon={<Ruler size={20} />} label="Measures" onClick={() => setComingSoon('Measures')} />
        <DashboardButton icon={<CalendarDays size={20} />} label="Calendar" onClick={() => navigate('/workout/history')} />
      </div>
      <p className="mb-3 rounded-lg bg-surface-higher px-3 py-2 text-[11px] text-white/40">
        Statistics and Measures modules will be built in a future update.
      </p>

      <button
        onClick={loadDemoData}
        className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 py-2.5 text-xs font-semibold text-white/50"
      >
        <Sparkles size={13} /> Load Example Data
      </button>

      <EditProfileSheet open={editOpen} onClose={() => setEditOpen(false)} profile={profile} onSave={updateProfile} />
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} onSave={updateSettings} />

      {comingSoon && (
        <Sheet open onClose={() => setComingSoon(null)} title={comingSoon}>
          <div className="p-4">
            <p className="text-sm text-white/70">The {comingSoon} module will be designed in a future update.</p>
            <button onClick={() => setComingSoon(null)} className="mt-4 w-full rounded-xl bg-accent py-3 text-sm font-bold">
              Got it
            </button>
          </div>
        </Sheet>
      )}
    </div>
  )
}

function MetricCol({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-white/40">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  )
}

function CategoryRow({
  icon,
  color,
  title,
  details,
}: {
  icon: React.ReactNode
  color: string
  title: string
  details: [string, string][]
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-higher p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: color + '30', color }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold">{title}</p>
        <div className="mt-1 flex gap-4">
          {details.map(([label, value]) => (
            <div key={label}>
              <p className="text-[9px] text-white/40">{label}</p>
              <p className="text-xs font-bold" style={{ color }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DashboardButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 rounded-xl bg-surface-raised px-4 py-4">
      <span className="text-white/80">{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  )
}

function EditProfileSheet({
  open,
  onClose,
  profile,
  onSave,
}: {
  open: boolean
  onClose: () => void
  profile: { username: string; sex: string; bio: string; avatarColorIndex: number }
  onSave: (patch: Partial<{ username: string; sex: string; bio: string; avatarColorIndex: number }>) => void
}) {
  const [username, setUsername] = useState(profile.username)
  const [sex, setSex] = useState(profile.sex)
  const [bio, setBio] = useState(profile.bio)
  const [avatarColorIndex, setAvatarColorIndex] = useState(profile.avatarColorIndex)
  const sexOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say']

  function submit() {
    onSave({ username: username.trim() || 'Athlete', sex, bio: bio.trim(), avatarColorIndex })
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Edit Profile">
      <div className="space-y-4 p-4">
        <div>
          <p className="mb-2 text-xs font-bold text-white/50">Avatar Color</p>
          <div className="flex gap-2.5">
            {AVATAR_COLORS.map((c, i) => (
              <button
                key={c}
                onClick={() => setAvatarColorIndex(i)}
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: c, boxShadow: avatarColorIndex === i ? '0 0 0 3px white' : undefined }}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-bold text-white/50">Display Name</p>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg bg-surface-higher px-3 py-2.5 text-sm outline-none"
          />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-bold text-white/50">Sex / Gender</p>
          <div className="flex flex-wrap gap-2">
            {sexOptions.map((o) => (
              <button
                key={o}
                onClick={() => setSex(o)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${sex === o ? 'bg-accent text-white' : 'bg-surface-higher text-white/50'}`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-bold text-white/50">Bio</p>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full rounded-lg bg-surface-higher px-3 py-2.5 text-sm outline-none"
          />
        </div>
        <button onClick={submit} className="w-full rounded-xl bg-accent py-3 text-sm font-bold">
          Save
        </button>
      </div>
    </Sheet>
  )
}

function SettingsSheet({
  open,
  onClose,
  settings,
  onSave,
}: {
  open: boolean
  onClose: () => void
  settings: {
    weightUnit: 'kg' | 'lbs'
    defaultRestTimerSec: number
    workoutReminders: boolean
    climbingAlerts: boolean
    mobilityReminders: boolean
    boulderingGradeSystem: string
    dailyMobilityTargetMins: number
    soundEffectsEnabled: boolean
  }
  onSave: (patch: Partial<typeof settings>) => void
}) {
  const [temp, setTemp] = useState(settings)

  function submit() {
    onSave(temp)
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="App Settings" fullHeight>
      <div className="space-y-5 p-4">
        <SettingsSection title="Notifications">
          <ToggleRow label="Workout Reminders" checked={temp.workoutReminders} onChange={(v) => setTemp({ ...temp, workoutReminders: v })} />
          <ToggleRow label="Climbing Session Alerts" checked={temp.climbingAlerts} onChange={(v) => setTemp({ ...temp, climbingAlerts: v })} />
          <ToggleRow
            label="Daily Mobility Stretch Alerts"
            checked={temp.mobilityReminders}
            onChange={(v) => setTemp({ ...temp, mobilityReminders: v })}
          />
        </SettingsSection>

        <SettingsSection title="Sound">
          <ToggleRow
            label="Sound Effects (PRs, Achievements & Timers)"
            checked={temp.soundEffectsEnabled}
            onChange={(v) => setTemp({ ...temp, soundEffectsEnabled: v })}
          />
        </SettingsSection>

        <SettingsSection title="Workout Preferences">
          <ChipRow
            label="Weight Unit"
            options={['kg', 'lbs']}
            value={temp.weightUnit}
            color="#0C7CFF"
            onChange={(v) => setTemp({ ...temp, weightUnit: v as 'kg' | 'lbs' })}
          />
          <ChipRow
            label="Default Rest Timer"
            options={['60', '90', '120', '180']}
            valueSuffix="s"
            value={String(temp.defaultRestTimerSec)}
            color="#0C7CFF"
            onChange={(v) => setTemp({ ...temp, defaultRestTimerSec: Number(v) })}
          />
        </SettingsSection>

        <SettingsSection title="Climbing Preferences">
          <ChipRow
            label="Bouldering Grade Scale"
            options={['V-Scale', 'Fontainebleau']}
            value={temp.boulderingGradeSystem}
            color="#FB923C"
            onChange={(v) => setTemp({ ...temp, boulderingGradeSystem: v })}
          />
        </SettingsSection>

        <SettingsSection title="Mobility Preferences">
          <ChipRow
            label="Daily Mobility Target"
            options={['10', '15', '20', '30']}
            valueSuffix="m"
            value={String(temp.dailyMobilityTargetMins)}
            color="#34D399"
            onChange={(v) => setTemp({ ...temp, dailyMobilityTargetMins: Number(v) })}
          />
        </SettingsSection>

        <button onClick={submit} className="w-full rounded-xl bg-accent py-3 text-sm font-bold">
          Save Settings
        </button>
      </div>
    </Sheet>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-white/40">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/70">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`h-6 w-11 rounded-full p-0.5 transition-colors ${checked ? 'bg-accent' : 'bg-surface-higher'}`}
        aria-label={label}
      >
        <span className={`block h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}

function ChipRow({
  label,
  options,
  value,
  valueSuffix = '',
  color,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  valueSuffix?: string
  color: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs text-white/50">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${value === o ? 'text-white' : 'bg-surface-higher text-white/60'}`}
            style={value === o ? { backgroundColor: color } : undefined}
          >
            {o}
            {valueSuffix}
          </button>
        ))}
      </div>
    </div>
  )
}
