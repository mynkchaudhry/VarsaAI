import { Link } from 'react-router-dom'

const links = [
  { label: 'Properties', to: '/properties' },
  { label: 'Chat', to: '/chat' },
  { label: 'About', to: '/about' },
  { label: 'Privacy', to: '#' },
  { label: 'RERA Compliance', to: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white px-6 md:px-10 xl:px-20 py-10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="9" fill="#F8F5F0"/>
                <path d="M7 9h4.5l4.5 9 4.5-9H25L16 23 7 9z" fill="#1A1A2E"/>
                <path d="M12 9h8L16 17 12 9z" fill="#1A1A2E" opacity="0.35"/>
              </svg>
              <span className="font-display text-xl font-bold">Varsa</span>
            </div>
            <p className="text-[0.82rem] text-[#6E6E6E] leading-relaxed">
              AI-powered Dubai property search. 48 live projects, real data, zero fluff.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 list-none m-0 p-0">
              {links.map(l => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[0.8rem] text-[#888] no-underline hover:text-white transition-colors duration-150"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="border-t border-[#222] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[0.72rem] text-[#555]">© 2026 Varsa. All rights reserved.</p>
          <p className="text-[0.72rem] text-[#555]">Built for Dubai. Powered by real data.</p>
        </div>
      </div>
    </footer>
  )
}
