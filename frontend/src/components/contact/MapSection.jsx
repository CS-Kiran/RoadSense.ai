import { Card } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

export default function MapSection() {
  return (
    <section className="border-t bg-slate-50 py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Find Us on the Map</h2>
          <p className="mb-8 text-muted-foreground">
            Located in the heart of Pune, Maharashtra. Drop by for a coffee and chat about making roads safer!
          </p>
          
          {/* Placeholder for Map - Replace with actual map integration */}
          <Card className="overflow-hidden">
            <div className="flex h-[400px] items-center justify-center bg-slate-100">
              <div className="text-center">
                <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Map integration placeholder</p>
                <p className="text-sm text-muted-foreground">
                  Integrate with Google Maps, Mapbox, or Leaflet
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}