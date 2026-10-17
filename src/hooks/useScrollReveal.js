import { useEffect, useRef } from 'react'

export function useScrollReveal(options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px', ...options }
    )

    el.style.opacity = '0'
    el.style.transform = 'translateY(28px)'
    el.style.transition = 'opacity 0.65s ease, transform 0.65s ease'

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1'
      el.style.transform = 'none'
    } else {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return ref
}
