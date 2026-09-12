import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Pencil, Sparkles, X, Check, SkipForward, Timer, ClipboardCheck, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react'
import { useWorkoutStore } from '../store/useWorkoutStore'
import { DAILY_AI_ROUTINE } from '../data/mobility'
import type { BodyAreaScore, MobilityRoutine } from '../types'
import Sheet from '../components/Sheet'
import { useDragScroll } from '../lib/useDragScroll'
import { relativeDate } from '../lib/format'

const DURATION_OPTIONS = [5, 10, 15, 20, 30]

function scaleRoutineDuration(routine: MobilityRoutine, targetMinutes: number): MobilityRoutine {
  const originalTotal = routine.exercises.reduce((n, e) => n + e.durationSeconds, 0) || 1
  const targetTotal = targetMinutes * 60
  const scale = targetTotal / originalTotal
  return {
    ...routine,
    durationMinutes: targetMinutes,
    exercises: routine.exercises.map((e) => ({ ...e, durationSeconds: Math.max(20, Math.round(e.durationSeconds * scale)) })),
  }
}

export default function Mobility() {
  const navigate = useNavigate()
  const bodyAreaScores = useWorkoutStore((s) => s.bodyAreaScores)
  const assessmentCompletedAt = useWorkoutStore((s) => s.assessmentCompletedAt)
  const mobilityRoutines = useWorkoutStore((s) => s.mobilityRoutines)
  const deleteMobilityRoutine = useWorkoutStore((s) => s.deleteMobilityRoutine)
  const logMobilitySession = useWorkoutStore((s) => s.logMobilitySession)

  const [durationPickerFor, setDurationPickerFor] = useState<MobilityRoutine | null>(null)
  const [activeRoutine, setActiveRoutine] = useState<MobilityRoutine | null>(null)
  const [assessmentOpen, setAssessmentOpen] = useState(false)
  const scoresScrollRef = useDragScroll<HTMLDivElement>()

  const overallScore = Math.round(bodyAreaScores.reduce((n, s) => n + s.scorePercentage, 0) / (bodyAreaScores.length || 1))

  return (
    <div className="px-4 pb-8 pt-2">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
        <Sparkles size={13} /> Flexibility & Range of Motion
      </p>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Mobility</h1>
        <button
          onClick={() => navigate('/stretches')}
          className="flex items-center gap-1.5 rounded-lg bg-surface-raised px-2.5 py-1.5 text-xs font-semibold text-emerald-400"
        >
          <BookOpen size={14} /> Stretch Library
        </button>
      </div>

      <div className="mb-4 rounded-xl bg-surface-raised p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">Mobility Index</p>
            <p className="text-base font-bold">Body Mobility Profile</p>
            <p className="mt-0.5 text-[10px] text-white/30">
              {assessmentCompletedAt ? `Last assessed ${relativeDate(assessmentCompletedAt)}` : 'Estimated — take the assessment for real scores'}
            </p>
          </div>
          <div className="rounded-xl bg-surface-higher px-3 py-1.5 text-center ring-1 ring-emerald-400/30">
            <span className="text-lg font-extrabold text-emerald-400">{overallScore}%</span>
            <span className="ml-1 text-[10px] text-white/40">Overall</span>
          </div>
        </div>
        <div ref={scoresScrollRef} className="no-scrollbar flex cursor-grab select-none gap-2.5 overflow-x-auto active:cursor-grabbing">
          {bodyAreaScores.map((score) => {
            const color = score.scorePercentage >= 80 ? '#34D399' : score.scorePercentage >= 60 ? '#0C7CFF' : '#FBBF24'
            return (
              <div key={score.areaName} className="w-[110px] shrink-0 rounded-xl bg-surface-higher p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{score.areaName}</span>
                  <span className="text-xs font-bold" style={{ color }}>
                    {score.scorePercentage}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full" style={{ width: `${score.scorePercentage}%`, backgroundColor: color }} />
                </div>
                <p className="mt-1.5 text-[9px] font-semibold text-white/40">{score.statusLabel}</p>
              </div>
            )
          })}
        </div>
      </div>

      <button
        onClick={() => setAssessmentOpen(true)}
        className="mb-4 w-full rounded-xl bg-surface-raised p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15">
            <ClipboardCheck size={18} className="text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Mobility Assessment Test</p>
            <p className="text-xs text-white/50">5 real self-tests to measure your ankles, hips, shoulders & spine</p>
          </div>
          <ChevronRight size={16} className="text-white/30" />
        </div>
      </button>

      <div className="mb-4 rounded-xl bg-surface-raised p-4 ring-1 ring-emerald-400/20">
        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
          <Sparkles size={12} /> Daily AI Customized Routine
        </div>
        <p className="text-base font-bold">{DAILY_AI_ROUTINE.title}</p>
        <p className="mt-0.5 text-xs text-white/50">{DAILY_AI_ROUTINE.description}</p>
        <button
          onClick={() => setDurationPickerFor(DAILY_AI_ROUTINE)}
          className="mt-3 w-full rounded-lg bg-emerald-500 py-2.5 text-xs font-bold"
        >
          Start Today's Routine
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold">Custom Sessions</h2>
        <button
          onClick={() => navigate('/mobility/routine/new')}
          className="flex items-center gap-1 rounded-lg bg-surface-raised px-2.5 py-1.5 text-xs font-semibold text-emerald-400"
        >
          <Plus size={14} /> Create Routine
        </button>
      </div>

      {mobilityRoutines.length === 0 ? (
        <div className="rounded-xl border border-dashed border-surface-border px-4 py-8 text-center">
          <p className="text-sm text-white/50">No custom routines yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {mobilityRoutines.map((r) => (
            <li key={r.id} className="rounded-xl bg-surface-raised p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{r.title}</p>
                  <p className="text-xs text-white/50">{r.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => navigate(`/mobility/routine/${r.id}`)}
                    className="text-white/40"
                    aria-label="Edit routine"
                  >
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => deleteMobilityRoutine(r.id)} className="text-red-400/80" aria-label="Delete routine">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-white/40">
                  {r.exercises.length} exercises • {r.durationMinutes} min
                </span>
                <button
                  onClick={() => setDurationPickerFor(r)}
                  className="rounded-lg bg-surface-higher px-3 py-1.5 text-xs font-bold text-emerald-400"
                >
                  Start
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <DurationPickerSheet
        routine={durationPickerFor}
        onClose={() => setDurationPickerFor(null)}
        onPick={(minutes) => {
          if (durationPickerFor) setActiveRoutine(scaleRoutineDuration(durationPickerFor, minutes))
          setDurationPickerFor(null)
        }}
      />

      {activeRoutine && (
        <MobilitySessionSheet
          routine={activeRoutine}
          onFinish={(durationSeconds) => {
            logMobilitySession(activeRoutine, durationSeconds)
            setActiveRoutine(null)
          }}
          onClose={() => setActiveRoutine(null)}
        />
      )}

      {assessmentOpen && <MobilityAssessmentSheet onClose={() => setAssessmentOpen(false)} />}
    </div>
  )
}

function DurationPickerSheet({
  routine,
  onClose,
  onPick,
}: {
  routine: MobilityRoutine | null
  onClose: () => void
  onPick: (minutes: number) => void
}) {
  return (
    <Sheet open={!!routine} onClose={onClose} title="Choose Session Length">
      <div className="p-4">
        <p className="mb-4 text-sm text-white/60">
          {routine?.title} normally runs {routine?.durationMinutes} min. Pick how long you'd like today's session to be — every
          stretch will be scaled to fit.
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {DURATION_OPTIONS.map((m) => (
            <button
              key={m}
              onClick={() => onPick(m)}
              className={`rounded-xl py-4 text-sm font-extrabold ${
                routine?.durationMinutes === m ? 'bg-emerald-500 text-white' : 'bg-surface-higher text-white/80'
              }`}
            >
              {m}
              <span className="block text-[10px] font-medium opacity-70">min</span>
            </button>
          ))}
        </div>
      </div>
    </Sheet>
  )
}

function MobilitySessionSheet({
  routine,
  onFinish,
  onClose,
}: {
  routine: MobilityRoutine
  onFinish: (durationSeconds: number) => void
  onClose: () => void
}) {
  const [index, setIndex] = useState(0)
  const [remaining, setRemaining] = useState(routine.exercises[0]?.durationSeconds ?? 0)
  const [startedAt] = useState(Date.now())
  const current = routine.exercises[index]

  useEffect(() => {
    setRemaining(routine.exercises[index]?.durationSeconds ?? 0)
  }, [index, routine])

  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(id)
  }, [remaining])

  function next() {
    if (index + 1 < routine.exercises.length) {
      setIndex((i) => i + 1)
    } else {
      onFinish(Math.round((Date.now() - startedAt) / 1000))
    }
  }

  if (!current) return null

  const mm = Math.floor(remaining / 60)
  const ss = (remaining % 60).toString().padStart(2, '0')

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-surface animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3.5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">Active Mobility Session</p>
          <p className="text-base font-bold">{routine.title}</p>
        </div>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-raised" aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <p className="mb-1 text-xs font-bold text-white/40">
          Exercise {index + 1} of {routine.exercises.length}
        </p>
        <p className="mb-1 text-xl font-extrabold">{current.name}</p>
        <p className="mb-6 text-sm text-white/50">Target: {current.targetArea}</p>
        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-surface-raised ring-4 ring-emerald-400/30">
          <span className="text-3xl font-extrabold tabular-nums">
            {mm}:{ss}
          </span>
        </div>
      </div>

      <div className="space-y-2 px-4 pb-8">
        <button onClick={next} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold">
          {index + 1 < routine.exercises.length ? (
            <>
              <SkipForward size={16} /> Next Stretch
            </>
          ) : (
            <>
              <Check size={16} /> Complete Protocol
            </>
          )}
        </button>
        <div className="flex items-center justify-center gap-1.5 text-xs text-white/30">
          <Timer size={12} /> Auto-counts down — tap Next anytime to move on
        </div>
      </div>
    </div>
  )
}

// ---- Mobility Assessment ----
// Five self-administered screens grounded in real physical-therapy/S&C
// assessments: the weight-bearing knee-to-wall test (ankle dorsiflexion),
// the Apley scratch test (shoulder rotation), an FMS-style overhead squat
// compensation check, the sit-and-reach test (hamstrings/low back), and the
// 90/90 hip rotation test.

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function statusLabel(score: number) {
  return score >= 80 ? 'Optimal' : score >= 60 ? 'Good' : 'Needs Work'
}

function scoreAnkle(cm: number) {
  return clamp(Math.round((cm / 12) * 100), 0, 100)
}
function scoreApleyGap(gapCm: number) {
  return gapCm <= 0 ? 100 : clamp(Math.round(100 - gapCm * 4), 0, 100)
}
function scoreSquat(flags: { heelsRise: boolean; kneesCaveIn: boolean; armsFallForward: boolean; backRounds: boolean; pain: boolean }) {
  if (flags.pain) return 0
  const count = [flags.heelsRise, flags.kneesCaveIn, flags.armsFallForward, flags.backRounds].filter(Boolean).length
  return clamp(100 - count * 22, 0, 100)
}
function scoreSitReach(cm: number) {
  return clamp(Math.round(50 + cm * 4), 0, 100)
}
function scoreHipRotation(rating: number) {
  return Math.round((rating / 3) * 100)
}

interface AssessmentAnswers {
  ankleCm: number
  apleyRightGapCm: number
  apleyLeftGapCm: number
  squatFlags: { heelsRise: boolean; kneesCaveIn: boolean; armsFallForward: boolean; backRounds: boolean; pain: boolean }
  sitReachCm: number
  hipRotationRating: number
}

const DEFAULT_ANSWERS: AssessmentAnswers = {
  ankleCm: 8,
  apleyRightGapCm: 8,
  apleyLeftGapCm: 8,
  squatFlags: { heelsRise: false, kneesCaveIn: false, armsFallForward: false, backRounds: false, pain: false },
  sitReachCm: 0,
  hipRotationRating: 2,
}

function computeAreaScores(a: AssessmentAnswers): BodyAreaScore[] {
  const apleyScore = Math.round((scoreApleyGap(a.apleyRightGapCm) + scoreApleyGap(a.apleyLeftGapCm)) / 2)
  const ankleScore = scoreAnkle(a.ankleCm)
  const squatScore = scoreSquat(a.squatFlags)
  const sitReachScore = scoreSitReach(a.sitReachCm)
  const hipScore = scoreHipRotation(a.hipRotationRating)

  const hips = Math.round((squatScore + hipScore) / 2)
  const shoulders = apleyScore
  const overhead = Math.round((apleyScore + squatScore) / 2)
  const ankles = Math.round((ankleScore + squatScore) / 2)

  return [
    { areaName: 'Hips', scorePercentage: hips, statusLabel: statusLabel(hips) },
    { areaName: 'Shoulders', scorePercentage: shoulders, statusLabel: statusLabel(shoulders) },
    { areaName: 'Overhead', scorePercentage: overhead, statusLabel: statusLabel(overhead) },
    { areaName: 'Ankles', scorePercentage: ankles, statusLabel: statusLabel(ankles) },
    { areaName: 'Hamstrings', scorePercentage: sitReachScore, statusLabel: statusLabel(sitReachScore) },
    { areaName: 'Lower Back', scorePercentage: sitReachScore, statusLabel: statusLabel(sitReachScore) },
  ]
}

function MobilityAssessmentSheet({ onClose }: { onClose: () => void }) {
  const bodyAreaScores = useWorkoutStore((s) => s.bodyAreaScores)
  const completeAssessment = useWorkoutStore((s) => s.completeAssessment)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswers>(DEFAULT_ANSWERS)

  const totalSteps = 6 // intro + 5 tests; results is a separate final screen
  const results = useMemo(() => computeAreaScores(answers), [answers])

  function patch(p: Partial<AssessmentAnswers>) {
    setAnswers((prev) => ({ ...prev, ...p }))
  }

  function finish() {
    completeAssessment(results)
    onClose()
  }

  return (
    <Sheet open onClose={onClose} title="Mobility Assessment" fullHeight>
      <div className="flex h-full flex-col">
        {step > 0 && step <= totalSteps - 1 && (
          <div className="flex gap-1 px-4 pt-3">
            {Array.from({ length: totalSteps - 1 }).map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i < step ? 'bg-emerald-400' : 'bg-surface-higher'}`} />
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {step === 0 && (
            <div>
              <p className="mb-2 text-lg font-extrabold">5 quick self-tests</p>
              <p className="mb-4 text-sm leading-relaxed text-white/60">
                These are simplified versions of tests strength coaches and physical therapists actually use — the
                weight-bearing knee-to-wall test, the Apley scratch test, an overhead-squat compensation check, the
                sit-and-reach test, and the 90/90 hip test. You'll need about 5 minutes and a wall.
              </p>
              <div className="rounded-xl bg-surface-higher p-3 text-xs text-white/50">
                No equipment required beyond a wall and, ideally, a broomstick or towel for the squat test. Do your
                best estimate — this isn't a clinical diagnosis, just a way to track your own mobility over time.
              </div>
            </div>
          )}

          {step === 1 && (
            <TestStep
              title="Ankle Dorsiflexion"
              subtitle="Knee-to-Wall Test"
              instructions={[
                'Kneel in a half-kneeling position facing a wall, front foot a few inches away.',
                'Keeping your heel flat on the floor, slide your foot forward as far as you can while still touching your knee to the wall.',
                'Measure the distance from your big toe to the wall.',
              ]}
              benchmark="10cm+ is considered normal mobility; under 4cm suggests a real restriction."
            >
              <SliderInput label="Distance from wall" value={answers.ankleCm} min={0} max={16} step={0.5} unit="cm" onChange={(v) => patch({ ankleCm: v })} />
            </TestStep>
          )}

          {step === 2 && (
            <TestStep
              title="Shoulder Rotation"
              subtitle="Apley Scratch Test"
              instructions={[
                'Reach one arm up and over your shoulder, reaching down your back.',
                'Reach your other arm up behind your lower back, reaching upward.',
                'Try to touch your middle fingers together. Measure the gap (0 if they touch or overlap). Repeat on both sides.',
              ]}
              benchmark="A gap under ~8cm is typical; a gap over 3cm bigger on one side than the other suggests an imbalance."
            >
              <SliderInput label="Right arm over top — gap" value={answers.apleyRightGapCm} min={0} max={25} step={0.5} unit="cm" onChange={(v) => patch({ apleyRightGapCm: v })} />
              <div className="h-3" />
              <SliderInput label="Left arm over top — gap" value={answers.apleyLeftGapCm} min={0} max={25} step={0.5} unit="cm" onChange={(v) => patch({ apleyLeftGapCm: v })} />
            </TestStep>
          )}

          {step === 3 && (
            <TestStep
              title="Overhead Squat"
              subtitle="Full-Body Compensation Check"
              instructions={[
                'Stand feet shoulder-width apart, arms extended overhead holding a stick or towel.',
                'Squat as low as you comfortably can, keeping heels down, torso upright, and the stick over your feet.',
                'Film yourself from the front and side (or have someone watch), then check anything you notice below.',
              ]}
              benchmark="Fewer compensations = better mobility through the ankles, hips, and shoulders together."
            >
              <div className="space-y-2.5">
                <CheckRow label="Heels lift off the floor" checked={answers.squatFlags.heelsRise} onChange={(v) => patch({ squatFlags: { ...answers.squatFlags, heelsRise: v } })} />
                <CheckRow label="Knees cave inward" checked={answers.squatFlags.kneesCaveIn} onChange={(v) => patch({ squatFlags: { ...answers.squatFlags, kneesCaveIn: v } })} />
                <CheckRow label="Arms/stick drift forward" checked={answers.squatFlags.armsFallForward} onChange={(v) => patch({ squatFlags: { ...answers.squatFlags, armsFallForward: v } })} />
                <CheckRow label="Lower back rounds or over-arches" checked={answers.squatFlags.backRounds} onChange={(v) => patch({ squatFlags: { ...answers.squatFlags, backRounds: v } })} />
                <CheckRow label="I feel pain during this movement" checked={answers.squatFlags.pain} onChange={(v) => patch({ squatFlags: { ...answers.squatFlags, pain: v } })} destructive />
              </div>
            </TestStep>
          )}

          {step === 4 && (
            <TestStep
              title="Hamstrings & Low Back"
              subtitle="Sit-and-Reach Test"
              instructions={[
                'Sit on the floor, legs straight out in front of you, feet flexed.',
                'Reach forward slowly with both hands toward your toes, keeping your knees straight — don’t bounce.',
                'Measure how far past your toes you reach (positive), or how far short you fall (negative).',
              ]}
              benchmark="Reaching your toes or beyond is a good baseline; falling more than 10cm short suggests tight hamstrings or low back."
            >
              <SliderInput label="Reach vs. toes" value={answers.sitReachCm} min={-20} max={20} step={1} unit="cm" onChange={(v) => patch({ sitReachCm: v })} />
            </TestStep>
          )}

          {step === 5 && (
            <TestStep
              title="Hip Rotation"
              subtitle="90/90 Test"
              instructions={[
                'Sit on the floor with both knees bent to 90°: one leg in front of you, one out to the side, both shins on the ground.',
                'Try to rotate through your hips to bring both knees flat to the floor without using your hands.',
              ]}
              benchmark="Both knees touching down comfortably indicates good hip internal/external rotation."
            >
              <div className="space-y-2">
                {[
                  { v: 0, label: 'Neither knee gets close to the floor' },
                  { v: 1, label: "Knees get within a few inches but don't touch" },
                  { v: 2, label: "One knee touches, the other doesn't quite" },
                  { v: 3, label: 'Both knees touch the floor comfortably' },
                ].map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => patch({ hipRotationRating: opt.v })}
                    className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                      answers.hipRotationRating === opt.v ? 'bg-emerald-500 text-white' : 'bg-surface-higher text-white/70'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </TestStep>
          )}

          {step === totalSteps && (
            <div>
              <p className="mb-1 text-lg font-extrabold">Your results</p>
              <p className="mb-4 text-sm text-white/60">Here's how these five tests translate into your body area scores.</p>
              <div className="space-y-2.5">
                {results.map((r) => {
                  const old = bodyAreaScores.find((b) => b.areaName === r.areaName)
                  const delta = old ? r.scorePercentage - old.scorePercentage : 0
                  const color = r.scorePercentage >= 80 ? '#34D399' : r.scorePercentage >= 60 ? '#0C7CFF' : '#FBBF24'
                  return (
                    <div key={r.areaName} className="rounded-xl bg-surface-higher p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">{r.areaName}</span>
                        <div className="flex items-center gap-1.5">
                          {old && delta !== 0 && (
                            <span className={`text-[10px] font-bold ${delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {delta > 0 ? '+' : ''}
                              {delta}
                            </span>
                          )}
                          <span className="text-sm font-extrabold" style={{ color }}>
                            {r.scorePercentage}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full" style={{ width: `${r.scorePercentage}%`, backgroundColor: color }} />
                      </div>
                      <p className="mt-1 text-[10px] font-semibold text-white/40">{r.statusLabel}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-surface-border p-4">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center justify-center gap-1 rounded-xl bg-surface-higher px-4 py-3 text-sm font-bold text-white/70"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {step < totalSteps ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-3 text-sm font-bold"
            >
              {step === 0 ? 'Start Assessment' : 'Next'} <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={finish} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-3 text-sm font-bold">
              <Check size={16} /> Save My Results
            </button>
          )}
        </div>
      </div>
    </Sheet>
  )
}

function TestStep({
  title,
  subtitle,
  instructions,
  benchmark,
  children,
}: {
  title: string
  subtitle: string
  instructions: string[]
  benchmark: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">{subtitle}</p>
      <p className="mb-3 text-lg font-extrabold">{title}</p>
      <ol className="mb-4 space-y-1.5">
        {instructions.map((step, i) => (
          <li key={i} className="flex gap-2 text-xs leading-relaxed text-white/60">
            <span className="shrink-0 font-bold text-emerald-400">{i + 1}.</span>
            {step}
          </li>
        ))}
      </ol>
      <div className="mb-5 rounded-lg bg-emerald-400/10 px-3 py-2 text-[11px] text-emerald-200/80">{benchmark}</div>
      {children}
    </div>
  )
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-white/60">{label}</span>
        <span className="text-sm font-extrabold text-emerald-400">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-500"
      />
    </div>
  )
}

function CheckRow({
  label,
  checked,
  onChange,
  destructive,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  destructive?: boolean
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold ${
        checked ? (destructive ? 'bg-red-500/20 text-red-300 ring-1 ring-red-400' : 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400') : 'bg-surface-higher text-white/70'
      }`}
    >
      {label}
      <div className={`flex h-5 w-5 items-center justify-center rounded-md ${checked ? (destructive ? 'bg-red-400' : 'bg-emerald-400') : 'bg-white/10'}`}>
        {checked && <Check size={13} strokeWidth={3} />}
      </div>
    </button>
  )
}
