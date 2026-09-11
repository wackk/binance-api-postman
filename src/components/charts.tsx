export function MiniBarChart({
  data,
  color,
  unitSuffix = '',
  height = 140,
}: {
  data: { label: string; value: number }[]
  color: string
  unitSuffix?: string
  height?: number
}) {
  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-surface-higher text-xs text-white/40"
        style={{ height }}
      >
        No data for this range
      </div>
    )
  }
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
            {d.value > 0 && (
              <span className="text-[9px] font-bold text-white/50">
                {d.value}
                {unitSuffix}
              </span>
            )}
            <div
              className="w-full rounded-t-md transition-all"
              style={{
                height: `${Math.max(4, (d.value / max) * (height - 24))}px`,
                backgroundColor: color,
                opacity: d.value === 0 ? 0.15 : 1,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[9px] text-white/40">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export function MiniLineChart({
  data,
  color,
  height = 140,
}: {
  data: { label: string; value: number; display: string }[]
  color: string
  height?: number
}) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-surface-higher text-xs text-white/40"
        style={{ height }}
      >
        No data for this range
      </div>
    )
  }
  const max = Math.max(...data.map((d) => d.value), 1)
  const min = Math.min(...data.map((d) => d.value), 0)
  const range = Math.max(max - min, 1)
  const w = 300
  const h = height - 24
  const step = data.length > 1 ? w / (data.length - 1) : 0
  const points = data.map((d, i) => {
    const x = data.length > 1 ? i * step : w / 2
    const y = h - ((d.value - min) / range) * (h - 16) - 8
    return { x, y, display: d.display }
  })
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={0} y1={(h / 3) * i} x2={w} y2={(h / 3) * i} stroke="white" strokeOpacity={0.06} />
        ))}
        <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill={color} />
            <circle cx={p.x} cy={p.y} r={1.6} fill="white" />
            <text x={p.x} y={Math.max(10, p.y - 8)} fontSize={9} fill={color} textAnchor="middle" fontWeight={700}>
              {p.display}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex gap-1">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[9px] text-white/40">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  )
}
