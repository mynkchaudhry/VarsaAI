import { useState, useEffect, useRef } from 'react'

export function useCountUp(target, suffix = '', duration = 1700) {
  const [value, setValue] = useState('0')
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const isDecimal = target % 1 !== 0
          const increment = target / (duration / 16)
          let n = 0
          const timer = setInterval(() => {
            n = Math.min(n + increment, target)
            const display = isDecimal
              ? n.toFixed(1)
              : Math.floor(n).toLocaleString()
            setValue(display + suffix)
            if (n >= target) clearInterval(timer)
          }, 16)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix, duration])

  return { value, ref }
}
