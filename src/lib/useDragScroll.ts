import { useEffect, useRef } from 'react'

/**
 * Lets a horizontally-scrolling container be dragged with a mouse, since the
 * artifact/emulator viewer runs on desktop where there's no touch swipe.
 * Real touch input is left alone — it already scrolls natively.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let dragging = false
    let moved = false
    let startX = 0
    let startScrollLeft = 0

    function suppressNextClick(e: MouseEvent) {
      e.preventDefault()
      e.stopPropagation()
    }

    function onPointerDown(e: PointerEvent) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      dragging = true
      moved = false
      startX = e.clientX
      startScrollLeft = el!.scrollLeft
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragging) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 4) moved = true
      el!.scrollLeft = startScrollLeft - dx
    }

    function endDrag() {
      if (!dragging) return
      dragging = false
      if (moved) {
        el!.addEventListener('click', suppressNextClick, { capture: true, once: true })
      }
    }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', endDrag)
    window.addEventListener('pointercancel', endDrag)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endDrag)
      window.removeEventListener('pointercancel', endDrag)
    }
  }, [])

  return ref
}
