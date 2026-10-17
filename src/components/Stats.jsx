import { useCountUp } from '../hooks/useCountUp'

const stats = [
  { target: 48,    suffix: '',   label: 'Live Projects' },
  { target: 1.2,   suffix: 'B AED', label: 'Transactions Analysed' },
  { target: 6.4,   suffix: '%', label: 'Avg. Net Rental Yield' },
  { target: 12000, suffix: '+', label: 'Buyers Helped' },
]

function StatItem({ target, suffix, label }) {
  const { value, ref } = useCountUp(target, suffix)
  return (
    <div ref={ref} className="flex flex-col gap-1 py-6 px-6 border-r border-[#E8E3DB] last:border-r-0">
      <div className="font-display text-[2rem] font-bold text-[#1A1A2E] leading-none">{value}</div>
      <div className="text-[0.72rem] text-[#888480] font-medium">{label}</div>
    </div>
  )
}

export default function Stats() {
  return (
    <div className="bg-white border-y border-[#E8E3DB]" aria-label="Key statistics">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x divide-[#E8E3DB]">
        {stats.map((s) => <StatItem key={s.label} {...s} />)}
      </div>
    </div>
  )
}
