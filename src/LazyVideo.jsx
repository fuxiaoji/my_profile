import { useEffect, useRef } from 'react'

export function LazyVideo({ autoPlay, children, ...props }) {
  const ref = useRef(null)
  useEffect(() => {
    const video = ref.current
    if (!video || !autoPlay) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) {
      if (!props['aria-hidden']) video.controls = true
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    }, { rootMargin: '80px' })
    observer.observe(video)
    return () => { observer.disconnect(); video.pause() }
  }, [autoPlay, props['aria-hidden']])
  return <video ref={ref} {...props} preload="none">{children}</video>
}
