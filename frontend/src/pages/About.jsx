import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/about/HeroSection'
import MissionSection from '@/components/about/MissionSection'
import TechStack from '@/components/about/TechStack'
import ImpactSection from '@/components/about/ImpactSection'
import FutureImplementations from '@/components/about/FutureImplementations'

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <MissionSection />
        <TechStack />
        <ImpactSection />
        <FutureImplementations />
      </main>
    </div>
  )
}