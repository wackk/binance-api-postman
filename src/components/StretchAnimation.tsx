/**
 * Draws a stretch as a solid 3D figure on a canvas.
 *
 * Pose data lives in data/stretchPoses.ts as bone directions in world space;
 * this file turns a pose into joint positions, orbits a camera around it and
 * paints the limbs back-to-front so nearer ones sit in front. Drag to orbit.
 */
import { useEffect, useRef } from 'react'
import {
  STRETCH_ANIMATIONS,
  keyframesFor,
  stageFor,
  hasStretchAnimation,
  type FigurePose,
  type Prop,
} from '../data/stretchPoses'
import { STRETCH_LIBRARY } from '../data/stretches'

export { hasStretchAnimation }

const D2R = Math.PI / 180

const BONE = {
  lumbar: 22, thorax: 24, neck: 20, headR: 11,
  upper: 28, fore: 26, thigh: 36, shin: 34, foot: 12,
  shoulderHalf: 10, hipHalf: 7.5,
}

const VIEW = { x0: 26, y0: 16, x1: 206, y1: 196 }

const STAGE_BG = '#181B21'
const NEAR_RGB = [150, 243, 200]
const FAR_RGB = [19, 86, 66]
const JOINT = 'rgba(240,180,41,.92)'

type Vec3 = [number, number, number]

function dir([az, el]: [number, number]): Vec3 {
  const a = az * D2R, e = el * D2R, ce = Math.cos(e)
  return [ce * Math.cos(a), Math.sin(e), ce * Math.sin(a)]
}
function walk(p: Vec3, ang: [number, number], len: number): Vec3 {
  const d = dir(ang)
  return [p[0] + d[0] * len, p[1] + d[1] * len, p[2] + d[2] * len]
}
function shift(p: Vec3, ang: [number, number], len: number, sign: number): Vec3 {
  const d = dir(ang)
  return [p[0] + d[0] * len * sign, p[1] + d[1] * len * sign, p[2] + d[2] * len * sign]
}

type Joints = Record<string, Vec3>

function solve(p: FigurePose): Joints {
  const pelvis: Vec3 = [p.pelvis[0], p.pelvis[1], p.pelvis[2]]
  const hipN = shift(pelvis, p.hipAxis, BONE.hipHalf, 1)
  const hipF = shift(pelvis, p.hipAxis, BONE.hipHalf, -1)
  const lspine = walk(pelvis, p.lumbar, BONE.lumbar)
  const chest = walk(lspine, p.thorax, BONE.thorax)
  const shN = shift(chest, p.shoulderAxis, BONE.shoulderHalf, 1)
  const shF = shift(chest, p.shoulderAxis, BONE.shoulderHalf, -1)
  const head = walk(chest, p.neck, BONE.neck)
  const elN = walk(shN, p.armN[0], BONE.upper)
  const elF = walk(shF, p.armF[0], BONE.upper)
  const knN = walk(hipN, p.legN[0], BONE.thigh)
  const knF = walk(hipF, p.legF[0], BONE.thigh)
  const anN = walk(knN, p.legN[1], BONE.shin)
  const anF = walk(knF, p.legF[1], BONE.shin)
  return {
    pelvis, hipN, hipF, lspine, chest, shN, shF, head,
    elN, haN: walk(elN, p.armN[1], BONE.fore),
    elF, haF: walk(elF, p.armF[1], BONE.fore),
    knN, anN, toN: walk(anN, p.legN[2], BONE.foot),
    knF, anF, toF: walk(anF, p.legF[2], BONE.foot),
  }
}

function lerpPose(a: FigurePose, b: FigurePose, f: number): FigurePose {
  const mix = (x: number, y: number) => x + (y - x) * f
  const ang = (x: [number, number], y: [number, number]): [number, number] => [mix(x[0], y[0]), mix(x[1], y[1])]
  return {
    pelvis: [mix(a.pelvis[0], b.pelvis[0]), mix(a.pelvis[1], b.pelvis[1]), mix(a.pelvis[2], b.pelvis[2])],
    hipAxis: ang(a.hipAxis, b.hipAxis),
    shoulderAxis: ang(a.shoulderAxis, b.shoulderAxis),
    lumbar: ang(a.lumbar, b.lumbar),
    thorax: ang(a.thorax, b.thorax),
    neck: ang(a.neck, b.neck),
    armN: [ang(a.armN[0], b.armN[0]), ang(a.armN[1], b.armN[1])],
    armF: [ang(a.armF[0], b.armF[0]), ang(a.armF[1], b.armF[1])],
    legN: [ang(a.legN[0], b.legN[0]), ang(a.legN[1], b.legN[1]), ang(a.legN[2], b.legN[2])],
    legF: [ang(a.legF[0], b.legF[0]), ang(a.legF[1], b.legF[1]), ang(a.legF[2], b.legF[2])],
  }
}

function poseAt(frames: FigurePose[], period: number, t: number): FigurePose {
  const n = frames.length
  if (n < 2) return frames[0]
  const span = period * (n - 1)
  const phase = (Math.max(0, t) % (span * 2)) / span
  const u = phase <= 1 ? phase : 2 - phase
  const pos = u * (n - 1)
  const i = Math.max(0, Math.min(n - 2, Math.floor(pos)))
  return lerpPose(frames[i], frames[i + 1], 0.5 - 0.5 * Math.cos(Math.PI * (pos - i)))
}

function depthColor(z: number): string {
  const u = Math.max(0, Math.min(1, (z + 52) / 104))
  const c = (i: number) => Math.round(FAR_RGB[i] + (NEAR_RGB[i] - FAR_RGB[i]) * u)
  return `rgb(${c(0)},${c(1)},${c(2)})`
}

interface Xf { s: number; X: (x: number) => number; Y: (y: number) => number }

function makeXf(w: number, h: number): Xf {
  const s = Math.min(w / (VIEW.x1 - VIEW.x0), h / (VIEW.y1 - VIEW.y0))
  const ox = (w - (VIEW.x1 - VIEW.x0) * s) / 2 - VIEW.x0 * s
  const oy = (h - (VIEW.y1 - VIEW.y0) * s) / 2 - VIEW.y0 * s
  return { s, X: (x) => x * s + ox, Y: (y) => y * s + oy }
}

function bone(ctx: CanvasRenderingContext2D, xf: Xf, a: Vec3, b: Vec3, w0: number, w1: number, color: string) {
  const n = Math.abs(w0 - w1) < 0.4 ? 1 : 5
  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  for (let i = 0; i < n; i++) {
    const u0 = i / n, u1 = (i + 1) / n
    ctx.lineWidth = (w0 + (w1 - w0) * ((u0 + u1) / 2)) * xf.s
    ctx.beginPath()
    ctx.moveTo(xf.X(a[0] + (b[0] - a[0]) * u0), xf.Y(a[1] + (b[1] - a[1]) * u0))
    ctx.lineTo(xf.X(a[0] + (b[0] - a[0]) * u1), xf.Y(a[1] + (b[1] - a[1]) * u1))
    ctx.stroke()
  }
}

function disc(ctx: CanvasRenderingContext2D, xf: Xf, p: Vec3, r: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(xf.X(p[0]), xf.Y(p[1]), r * xf.s, 0, Math.PI * 2)
  ctx.fill()
}

const SEGMENTS: Array<[string, string, number, number]> = [
  ['hipN', 'hipF', 15, 15],
  ['pelvis', 'lspine', 19, 17],
  ['lspine', 'chest', 17, 15],
  ['shN', 'shF', 14, 14],
  ['chest', 'head', 11, 11],
  ['shN', 'elN', 11, 9],
  ['elN', 'haN', 9, 6.5],
  ['shF', 'elF', 11, 9],
  ['elF', 'haF', 9, 6.5],
  ['hipN', 'knN', 15, 11],
  ['knN', 'anN', 11, 7.5],
  ['anN', 'toN', 7.5, 6],
  ['hipF', 'knF', 15, 11],
  ['knF', 'anF', 11, 7.5],
  ['anF', 'toF', 7.5, 6],
]

export default function StretchAnimation({ stretchId }: { stretchId: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const view = useRef({ yaw: 0, pitch: 0 })
  const drag = useRef({ active: false, x: 0, y: 0 })

  const anim = STRETCH_ANIMATIONS[stretchId]
  const kind = STRETCH_LIBRARY.find((s) => s.id === stretchId)?.type ?? 'passive'

  useEffect(() => {
    if (!anim) return
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    view.current = { yaw: 0, pitch: 0 }

    const frames = keyframesFor(anim)
    const stage = stageFor(anim)
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    let dpr = 1, w = 1, h = 1
    const resize = () => {
      const r = wrap.getBoundingClientRect()
      if (!r.width || !r.height) return
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    const render = (t: number) => {
      if (!w || !h) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = STAGE_BG
      ctx.fillRect(0, 0, w, h)

      const xf = makeXf(w, h)
      const joints = solve(poseAt(frames, stage.period, t))

      let cx = 0, cy = 0, n = 0
      for (const k in joints) { cx += joints[k][0]; cy += joints[k][1]; n++ }
      cx /= n; cy /= n

      const yawDeg = stage.yaw + view.current.yaw + (still ? 0 : 16 * Math.sin(t / 3800))
      const pitchDeg = Math.max(-62, Math.min(62, stage.pitch + view.current.pitch))
      const cyw = Math.cos(yawDeg * D2R), syw = Math.sin(yawDeg * D2R)
      const cp = Math.cos(pitchDeg * D2R), sp = Math.sin(pitchDeg * D2R)
      const cam = (p: Vec3): Vec3 => {
        const x = p[0] - cx, y = p[1] - cy, z = p[2]
        const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw
        return [cx + x1, cy + y * cp - z1 * sp, y * sp + z1 * cp]
      }

      drawFloor(ctx, xf, cam, stage.ground, cx)
      if (stage.prop) drawProp(ctx, xf, cam, stage.prop, stage.ground)

      const J: Joints = {}
      for (const k in joints) J[k] = cam(joints[k])

      const items = SEGMENTS.map(([a, b, w0, w1]) => ({
        a: J[a], b: J[b], w0, w1, z: (J[a][2] + J[b][2]) / 2, head: false,
      })) as Array<{ a: Vec3; b: Vec3; w0: number; w1: number; z: number; head: boolean }>
      items.push({ a: J.head, b: J.head, w0: 0, w1: 0, z: J.head[2], head: true })
      items.sort((p, q) => p.z - q.z)

      for (const it of items) {
        if (it.head) {
          disc(ctx, xf, it.a, BONE.headR + 1.7, STAGE_BG)
          disc(ctx, xf, it.a, BONE.headR, depthColor(it.z))
        } else {
          bone(ctx, xf, it.a, it.b, it.w0 + 3.4, it.w1 + 3.4, STAGE_BG)
          bone(ctx, xf, it.a, it.b, it.w0, it.w1, depthColor(it.z))
        }
      }
      for (const k of ['elN', 'knN', 'elF', 'knF']) disc(ctx, xf, J[k], 2.5, JOINT)
    }

    let raf = 0
    let clock = 0
    let last = performance.now()
    const loop = (now: number) => {
      clock += Math.max(0, Math.min(64, now - last))
      last = now
      render(clock)
      raf = requestAnimationFrame(loop)
    }

    if (still) {
      render(0)
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [anim, stretchId])

  if (!anim) return null

  return (
    <div className="flex flex-col items-center rounded-xl bg-surface-higher p-3">
      <div
        ref={wrapRef}
        className="h-44 w-full touch-pan-y overflow-hidden rounded-lg"
        onPointerDown={(e) => {
          drag.current = { active: true, x: e.clientX, y: e.clientY }
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!drag.current.active) return
          view.current.yaw += (e.clientX - drag.current.x) * 0.55
          view.current.pitch += (e.clientY - drag.current.y) * 0.4
          drag.current.x = e.clientX
          drag.current.y = e.clientY
        }}
        onPointerUp={() => { drag.current.active = false }}
        onPointerCancel={() => { drag.current.active = false }}
        onDoubleClick={() => { view.current = { yaw: 0, pitch: 0 } }}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
      <p className="mt-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-emerald-400/70">
        {kind === 'active' ? 'Active — keep moving' : 'Passive — hold & breathe'}
        <span className="ml-1.5 text-white/25">drag to rotate</span>
      </p>
    </div>
  )
}

function drawFloor(
  ctx: CanvasRenderingContext2D,
  xf: Xf,
  cam: (p: Vec3) => Vec3,
  ground: number,
  cx: number,
) {
  const half = 78, step = 19.5
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(255,255,255,.07)'
  ctx.beginPath()
  for (let i = -4; i <= 4; i++) {
    const a = cam([cx - half, ground, i * step])
    const b = cam([cx + half, ground, i * step])
    ctx.moveTo(xf.X(a[0]), xf.Y(a[1]))
    ctx.lineTo(xf.X(b[0]), xf.Y(b[1]))
    const c = cam([cx + i * step, ground, -half])
    const d = cam([cx + i * step, ground, half])
    ctx.moveTo(xf.X(c[0]), xf.Y(c[1]))
    ctx.lineTo(xf.X(d[0]), xf.Y(d[1]))
  }
  ctx.stroke()
}

function drawProp(
  ctx: CanvasRenderingContext2D,
  xf: Xf,
  cam: (p: Vec3) => Vec3,
  prop: Prop,
  ground: number,
) {
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(255,255,255,.1)'
  ctx.beginPath()
  if (prop.kind === 'wall') {
    for (let i = -2; i <= 2; i++) {
      const a = cam([prop.x, ground - 140, i * 21])
      const b = cam([prop.x, ground, i * 21])
      ctx.moveTo(xf.X(a[0]), xf.Y(a[1]))
      ctx.lineTo(xf.X(b[0]), xf.Y(b[1]))
    }
    for (let i = 0; i <= 4; i++) {
      const a = cam([prop.x, ground - 35 * i, -42])
      const b = cam([prop.x, ground - 35 * i, 42])
      ctx.moveTo(xf.X(a[0]), xf.Y(a[1]))
      ctx.lineTo(xf.X(b[0]), xf.Y(b[1]))
    }
  } else if (prop.kind === 'chair') {
    const corners: Vec3[] = [
      [prop.x - 30, prop.y, -26], [prop.x + 30, prop.y, -26],
      [prop.x + 30, prop.y, 26], [prop.x - 30, prop.y, 26],
    ]
    const seat = corners.map(cam)
    ctx.moveTo(xf.X(seat[0][0]), xf.Y(seat[0][1]))
    for (let i = 1; i < 4; i++) ctx.lineTo(xf.X(seat[i][0]), xf.Y(seat[i][1]))
    ctx.closePath()
    for (const c of corners) {
      const top = cam(c)
      const foot = cam([c[0], ground, c[2]])
      ctx.moveTo(xf.X(top[0]), xf.Y(top[1]))
      ctx.lineTo(xf.X(foot[0]), xf.Y(foot[1]))
    }
  } else {
    const a = cam([70, prop.y, 0])
    const b = cam([138, prop.y, 0])
    ctx.moveTo(xf.X(a[0]), xf.Y(a[1]))
    ctx.lineTo(xf.X(b[0]), xf.Y(b[1]))
  }
  ctx.stroke()
}
