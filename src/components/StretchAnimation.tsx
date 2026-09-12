/**
 * Looping illustrated demonstrations for how a stretch is performed.
 * Sample coverage only (standing-calf-stretch) — add more entries to
 * ANIMATIONS as illustrations are built for other stretches; everything
 * that reads this module (StretchDetail, the mobility session view)
 * already renders nothing when a stretch has no entry here.
 */

type AnimationRenderer = () => JSX.Element

const ANIMATIONS: Record<string, AnimationRenderer> = {
  'standing-calf-stretch': StandingCalfStretchAnimation,
}

export function hasStretchAnimation(stretchId: string | undefined): boolean {
  return !!stretchId && stretchId in ANIMATIONS
}

export default function StretchAnimation({ stretchId }: { stretchId: string }) {
  const Renderer = ANIMATIONS[stretchId]
  if (!Renderer) return null
  return (
    <div className="overflow-hidden rounded-xl bg-surface-higher">
      <Renderer />
    </div>
  )
}

function StandingCalfStretchAnimation() {
  return (
    <div className="flex flex-col items-center p-3">
      <svg viewBox="0 0 200 150" className="h-36 w-auto">
        <style>{`
          @keyframes calf-stretch-lean {
            0%, 15% { transform: rotate(0deg); }
            50% { transform: rotate(5deg); }
            85%, 100% { transform: rotate(0deg); }
          }
          .calf-stretch-upper-body {
            animation: calf-stretch-lean 2.6s ease-in-out infinite;
            transform-origin: 78px 92px;
          }
        `}</style>

        {/* ground */}
        <line x1="10" y1="146" x2="190" y2="146" stroke="#ffffff22" strokeWidth="2" />
        {/* wall */}
        <line x1="168" y1="15" x2="168" y2="146" stroke="#ffffff33" strokeWidth="4" />

        {/* legs (static — this is the held position) */}
        <g stroke="#34D399" strokeWidth="5" strokeLinecap="round" fill="none">
          {/* back leg, straight, heel down */}
          <line x1="78" y1="92" x2="50" y2="146" />
          {/* front leg, bent */}
          <line x1="78" y1="92" x2="98" y2="118" />
          <line x1="98" y1="118" x2="90" y2="146" />
        </g>

        {/* upper body (animated lean into the wall) */}
        <g className="calf-stretch-upper-body">
          <line x1="78" y1="92" x2="92" y2="48" stroke="#34D399" strokeWidth="5" strokeLinecap="round" />
          <line x1="92" y1="48" x2="160" y2="40" stroke="#34D399" strokeWidth="5" strokeLinecap="round" />
          <circle cx="97" cy="38" r="11" fill="#34D399" />
        </g>
      </svg>
      <p className="mt-1 text-center text-[11px] text-white/40">
        Back heel stays grounded — gently lean into the wall and ease off, breathing steadily.
      </p>
    </div>
  )
}
