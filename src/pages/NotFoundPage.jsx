import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-[#F8F5F0]">
        <div className="font-display text-[8rem] font-bold text-[#E8E3DB] leading-none mb-6 select-none">404</div>
        <h1 className="font-display text-2xl font-bold text-[#0D0D0D] mb-3">Page not found</h1>
        <p className="text-[#888480] text-sm mb-10 max-w-sm leading-relaxed">
          This page doesn't exist — but 48 amazing Dubai projects do. Let's get you back on track.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            to="/"
            className="bg-[#1A1A2E] text-white text-[0.82rem] font-semibold px-8 py-3.5 rounded-xl no-underline hover:bg-[#252545] transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/properties"
            className="border border-[#E8E3DB] text-[#3A3A3A] text-[0.82rem] font-semibold px-8 py-3.5 rounded-xl no-underline hover:border-[#1A1A2E] hover:text-[#1A1A2E] transition-all"
          >
            Browse properties
          </Link>
        </div>
      </div>
    </Layout>
  )
}
