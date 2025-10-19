import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/contact/HeroSection'
import ContactSection from '@/components/contact/ContactSection'
import MapSection from '@/components/contact/MapSection'

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ContactSection />
        <MapSection />
      </main>
    </div>
  )
}