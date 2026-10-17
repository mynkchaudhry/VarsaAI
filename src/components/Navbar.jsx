import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const navLinks = [
  { label: 'Properties', to: '/properties' },
  { label: 'Chat', to: '/chat' },
  { label: 'About', to: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 bg-[#F8F5F0] transition-all duration-200 ${scrolled ? 'border-b border-[#E8E3DB] shadow-[0_1px_0_0_#E8E3DB]' : ''}`}
      >
        <div className="max-w-screen-2xl mx-auto w-full flex items-center justify-between px-6 md:px-10 xl:px-20 h-16">
        <Link
          to="/"
          className="flex items-center gap-2.5 no-underline"
          aria-label="Varsa home"
        >
          {/* Logo mark */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="#1A1A2E"/>
            <path d="M7 9h4.5l4.5 9 4.5-9H25L16 23 7 9z" fill="white"/>
            <path d="M12 9h8L16 17 12 9z" fill="white" opacity="0.35"/>
          </svg>
          <span className="font-display text-[1.1rem] font-bold text-[#0D0D0D] tracking-tight leading-none">
            Varsa
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `text-[0.82rem] font-medium no-underline transition-colors duration-150 ${
                    isActive ? 'text-[#1A1A2E]' : 'text-[#888480] hover:text-[#0D0D0D]'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/chat')}
            className="hidden md:block bg-[#1A1A2E] text-white text-[0.78rem] font-semibold border-none rounded-lg px-5 py-2 cursor-pointer transition-colors duration-150 hover:bg-[#252545]"
          >
            Start chatting
          </button>
          <button
            className="md:hidden p-2 cursor-pointer bg-transparent border-none flex flex-col gap-[5px]"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={`block w-5 h-[1.5px] bg-[#0D0D0D] transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-[#0D0D0D] transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-[#0D0D0D] transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#F8F5F0] flex flex-col pt-20 px-8 pb-10 transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="text-[1.5rem] font-display font-semibold text-[#0D0D0D] no-underline py-3 border-b border-[#E8E3DB] hover:text-[#1A1A2E] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <button
          onClick={() => { setOpen(false); navigate('/chat') }}
          className="mt-8 bg-[#1A1A2E] text-white text-[0.9rem] font-semibold border-none rounded-xl px-8 py-4 cursor-pointer text-left"
        >
          Start chatting →
        </button>
      </div>
    </>
  )
}
