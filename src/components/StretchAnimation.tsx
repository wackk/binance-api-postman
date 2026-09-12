/**
 * A tiny data-driven "stick figure" illustrator for stretches.
 *
 * Each stretch is described by a `FigurePose` — a body orientation plus five
 * limb angles (in degrees, 0 = pointing right, 90 = pointing down) — rather
 * than hand-drawn SVG markup. A generic forward-kinematics helper turns that
 * into five line segments + a head, so adding coverage for a new stretch is
 * just adding a pose entry to STRETCH_ANIMATIONS in stretchPoses.ts, not
 * drawing a new illustration.
 *
 * Passive (held) stretches auto-generate a subtle "breathing" second pose and
 * crossfade to it and back. Active (movement) stretches provide an explicit
 * `activePose` (a partial override of the rest pose) and crossfade between
 * the two a little faster, suggesting repeated motion.
 */
import { STRETCH_ANIMATIONS } from '../data/stretchPoses'

export type FigureOrientation = 'standing' | 'kneeling' | 'seated' | 'lying' | 'hanging' | 'all-fours'
export type FigureProp = 'wall' | 'chair' | 'bar' | 'none'

export interface FigurePose {
  orientation: FigureOrientation
  torsoAngle: number
  armL: number
  armR: number
  legL: number
  legR: number
  prop?: FigureProp
  /** Degrees added to torsoAngle just for head placement — lets neck stretches show head tilt/rotation independent of the torso. */
  headTilt?: number
}

export interface StretchAnimationEntry {
  pose: FigurePose
  /** Only for active/movement stretches — the fields that change during the motion. */
  activePose?: Partial<FigurePose>
}

const RIGS: Record<FigureOrientation, { hip: [number, number]; torsoLen: number; armLen: number; legLen: number }> = {
  standing: { hip: [100, 95], torsoLen: 45, armLen: 34, legLen: 50 },
  kneeling: { hip: [100, 112], torsoLen: 42, armLen: 30, legLen: 26 },
  seated: { hip: [95, 118], torsoLen: 38, armLen: 30, legLen: 38 },
  lying: { hip: [70, 105], torsoLen: 42, armLen: 28, legLen: 42 },
  hanging: { hip: [100, 92], torsoLen: 38, armLen: 42, legLen: 48 },
  'all-fours': { hip: [125, 108], torsoLen: 42, armLen: 26, legLen: 22 },
}

function project([x, y]: [number, number], angleDeg: number, len: number): [number, number] {
  const r = (angleDeg * Math.PI) / 180
  return [x + len * Math.cos(r), y + len * Math.sin(r)]
}

function computeFigure(pose: FigurePose) {
  const rig = RIGS[pose.orientation]
  const hip = rig.hip
  const shoulder = project(hip, pose.torsoAngle, rig.torsoLen)
  const head = project(shoulder, pose.torsoAngle + (pose.headTilt ?? 0), 13)
  const handL = project(shoulder, pose.armL, rig.armLen)
  const handR = project(shoulder, pose.armR, rig.armLen)
  const footL = project(hip, pose.legL, rig.legLen)
  const footR = project(hip, pose.legR, rig.legLen)
  return { hip, shoulder, head, handL, handR, footL, footR }
}

function nudgePose(pose: FigurePose): FigurePose {
  return { ...pose, torsoAngle: pose.torsoAngle + 4, armL: pose.armL + 4, armR: pose.armR + 4 }
}

export function hasStretchAnimation(stretchId: string | undefined): boolean {
  return !!stretchId && stretchId in STRETCH_ANIMATIONS
}

export default function StretchAnimation({ stretchId }: { stretchId: string }) {
  const entry = STRETCH_ANIMATIONS[stretchId]
  if (!entry) return null

  const poseA = entry.pose
  const poseB: FigurePose = entry.activePose ? { ...poseA, ...entry.activePose } : nudgePose(poseA)
  const isActive = !!entry.activePose
  const duration = isActive ? 1.7 : 3.4

  const a = computeFigure(poseA)
  const b = computeFigure(poseB)

  return (
    <div className="flex flex-col items-center rounded-xl bg-surface-higher p-3">
      <style>{`
        @keyframes stretchFigA { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes stretchFigB { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
      `}</style>
      <svg viewBox="0 0 200 150" className="h-40 w-auto">
        <line x1="10" y1="146" x2="190" y2="146" stroke="#ffffff22" strokeWidth="2" />
        <FigureProps prop={poseA.prop} />
        <g style={{ animation: `stretchFigA ${duration}s ease-in-out infinite` }}>
          <FigureLines points={a} />
        </g>
        <g style={{ animation: `stretchFigB ${duration}s ease-in-out infinite` }}>
          <FigureLines points={b} />
        </g>
      </svg>
      <p className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wide text-emerald-400/70">
        {isActive ? 'Active — keep moving' : 'Passive — hold & breathe'}
      </p>
    </div>
  )
}

function FigureLines({ points }: { points: ReturnType<typeof computeFigure> }) {
  const { hip, shoulder, head, handL, handR, footL, footR } = points
  return (
    <g stroke="#34D399" strokeWidth="5" strokeLinecap="round" fill="none">
      <line x1={hip[0]} y1={hip[1]} x2={footL[0]} y2={footL[1]} />
      <line x1={hip[0]} y1={hip[1]} x2={footR[0]} y2={footR[1]} />
      <line x1={hip[0]} y1={hip[1]} x2={shoulder[0]} y2={shoulder[1]} />
      <line x1={shoulder[0]} y1={shoulder[1]} x2={handL[0]} y2={handL[1]} />
      <line x1={shoulder[0]} y1={shoulder[1]} x2={handR[0]} y2={handR[1]} />
      <circle cx={head[0]} cy={head[1]} r="10" fill="#34D399" stroke="none" />
    </g>
  )
}

function FigureProps({ prop }: { prop?: FigureProp }) {
  if (!prop || prop === 'none') return null
  if (prop === 'wall') return <line x1="172" y1="12" x2="172" y2="146" stroke="#ffffff33" strokeWidth="4" />
  if (prop === 'bar') return <line x1="55" y1="18" x2="145" y2="18" stroke="#ffffff44" strokeWidth="5" strokeLinecap="round" />
  if (prop === 'chair') {
    return (
      <g stroke="#ffffff33" strokeWidth="3" fill="none">
        <line x1="65" y1="146" x2="65" y2="108" />
        <line x1="65" y1="108" x2="108" y2="108" />
        <line x1="108" y1="108" x2="108" y2="146" />
      </g>
    )
  }
  return null
}
