import Layout from '../components/Layout'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import HowItWorks from '../components/HowItWorks'
import HomeProperties from '../components/HomeProperties'
import Features from '../components/Features'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Stats />
      <HowItWorks />
      <HomeProperties />
      <Features />
      <Testimonials />
      <CTA />
    </Layout>
  )
}
