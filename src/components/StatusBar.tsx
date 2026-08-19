import { useEffect, useState } from 'react'
import { Signal, Wifi, BatteryFull } from 'lucide-react'

export default function StatusBar() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000 * 15)
    return () => clearInterval(id)
  }, [])

  const hh = time.getHours() % 12 === 0 ? 12 : time.getHours() % 12
  const mm = time.getMinutes().toString().padStart(2, '0')

  return (
    <div className="flex shrink-0 items-center justify-between px-6 pb-1 pt-3 text-[13px] font-semibold text-white">
      <span>{hh}:{mm}</span>
      <div className="flex items-center gap-1.5">
        <Signal size={14} strokeWidth={2.5} />
        <Wifi size={14} strokeWidth={2.5} />
        <BatteryFull size={16} strokeWidth={2} />
      </div>
    </div>
  )
}
