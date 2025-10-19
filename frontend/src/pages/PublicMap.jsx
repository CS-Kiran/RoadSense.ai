import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Map, { createCustomIcon } from '@/components/Map/Map'
import { useState } from 'react'
import { Layers, MapPin } from 'lucide-react'

export default function PublicMap() {
  const [viewMode, setViewMode] = useState('markers') // 'markers' or 'heatmap'

  // Sample pothole locations in Pune with severity
  const potholeMarkers = [
    {
      lat: 18.5204,
      lng: 73.8567,
      title: 'Severe Pothole - FC Road',
      description: 'Large pothole causing traffic issues',
      severity: 'High',
      status: 'In Progress',
      intensity: 1.0
    },
    {
      lat: 18.5314,
      lng: 73.8446,
      title: 'Road Crack - JM Road',
      description: 'Multiple cracks spreading',
      severity: 'Medium',
      status: 'Pending',
      intensity: 0.7
    },
    {
      lat: 18.5074,
      lng: 73.8077,
      title: 'Minor Damage - Kothrud',
      description: 'Small pothole, needs attention',
      severity: 'Low',
      status: 'Resolved',
      intensity: 0.3
    },
    {
      lat: 18.5184,
      lng: 73.8527,
      title: 'Critical Issue - Deccan',
      description: 'Deep pothole, very dangerous',
      severity: 'Critical',
      status: 'Urgent',
      intensity: 1.0
    },
    {
      lat: 18.5240,
      lng: 73.8630,
      title: 'Road Surface Issue',
      description: 'Uneven road surface',
      severity: 'Medium',
      status: 'Reported',
      intensity: 0.6
    },
  ]

  // Convert markers to heatmap points
  const heatmapPoints = potholeMarkers.map(marker => ({
    lat: marker.lat,
    lng: marker.lng,
    intensity: marker.intensity || 0.5
  }))

  // Custom icon based on severity
  const getSeverityIcon = (severity) => {
    const config = {
      'Critical': { color: '#dc2626', icon: '!', size: 35 },
      'High': { color: '#ea580c', icon: '⚠', size: 32 },
      'Medium': { color: '#f59e0b', icon: '●', size: 28 },
      'Low': { color: '#10b981', icon: '○', size: 25 },
    }
    return createCustomIcon(config[severity] || config['Low'])
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-3xl text-center"
            >
              <Badge variant="outline" className="mb-4">
                Live Map View
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Public Road Issues Map
              </h1>
              <p className="text-lg text-muted-foreground">
                View all reported road issues in real-time. Track status, severity, and resolution progress.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="border-b bg-white py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">View Mode:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'markers' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('markers')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Markers
                </Button>
                <Button
                  variant={viewMode === 'heatmap' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('heatmap')}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Heatmap
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Legend */}
        <section className="bg-slate-50 py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-medium">Severity Levels:</span>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-red-600" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-orange-600" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-yellow-500" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-500" />
                <span>Low</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden shadow-lg">
              <div className="h-[600px]">
                <Map 
                  center={[18.5204, 73.8567]} 
                  zoom={13}
                  markers={viewMode === 'markers' ? potholeMarkers : []}
                  heatmapPoints={viewMode === 'heatmap' ? heatmapPoints : []}
                  heatmapOptions={{
                    radius: 30,
                    blur: 20,
                    maxZoom: 17,
                    max: 1.0,
                    gradient: {
                      0.0: 'green',
                      0.5: 'yellow',
                      0.7: 'orange',
                      1.0: 'red'
                    }
                  }}
                  showUserLocation={true}
                  customIcon={getSeverityIcon('High')}
                  onMarkerClick={(marker) => {
                    console.log('Marker clicked:', marker)
                  }}
                  height="600px"
                />
              </div>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {potholeMarkers.filter(m => m.severity === 'Critical').length}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">Critical Issues</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {potholeMarkers.filter(m => m.severity === 'High').length}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">High Priority</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {potholeMarkers.filter(m => m.severity === 'Medium').length}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">Medium Priority</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {potholeMarkers.filter(m => m.severity === 'Low').length}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">Low Priority</div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
