import { Badge } from '@/components/ui/badge'
import { Camera, MapPin, CheckCircle, Bell } from 'lucide-react'

const steps = [
  {
    icon: MapPin,
    step: '01',
    title: 'Spot the Issue',
    description: 'Identify a road problem in your area—pothole, crack, or damaged signage.',
  },
  {
    icon: Camera,
    step: '02',
    title: 'Report Instantly',
    description: 'Upload photos, add location, and describe the issue through our simple form.',
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'Track Progress',
    description: 'Government officials review, prioritize, and assign your report to maintenance teams.',
  },
  {
    icon: Bell,
    step: '04',
    title: 'Get Updates',
    description: 'Receive real-time notifications as your report moves from pending to resolved.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">Simple Process</Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            How Roadmap.ai Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From reporting to resolution in four simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {step.step}
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {/* Connecting line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-[60%] hidden h-0.5 w-[80%] bg-gradient-to-r from-primary to-primary/20 lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
