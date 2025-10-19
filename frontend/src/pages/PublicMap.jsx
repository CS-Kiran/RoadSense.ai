import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Map from '@/components/Map/Map'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useState } from 'react'
import { Layers, MapPin } from 'lucide-react'

export default function PublicMap() {
  const [viewMode, setViewMode] = useState('markers')

  const potholeMarkers = [
    {
      lat: 18.5204,
      lng: 73.8567,
      title: 'Severe Pothole - FC Road',
      description: 'Large pothole causing traffic issues',
      severity: 'High',
      status: 'In Progress',
    },
    {
      lat: 18.5314,
      lng: 73.8446,
      title: 'Road Crack - JM Road',
      description: 'Multiple cracks spreading',
      severity: 'Medium',
      status: 'Pending',
    },
    {
      lat: 18.5074,
      lng: 73.8077,
      title: 'Minor Damage - Kothrud',
      description: 'Small pothole, needs attention',
      severity: 'Low',
      status: 'Resolved',
    },
    {
      lat: 18.5184,
      lng: 73.8527,
      title: 'Critical Issue - Deccan',
      description: 'Deep pothole, very dangerous',
      severity: 'Critical',
      status: 'Urgent',
    },
    {
      lat: 18.5240,
      lng: 73.8630,
      title: 'Road Surface Issue - Baner',
      description: 'Uneven road surface',
      severity: 'Medium',
      status: 'Reported',
    },
    {
      lat: 18.5290,
      lng: 73.8470,
      title: 'Damaged Road - Shivajinagar',
      description: 'Road damage near junction',
      severity: 'High',
      status: 'In Progress',
    },
    {
      lat: 18.5150,
      lng: 73.8550,
      title: 'Surface Crack - Camp Area',
      description: 'Minor surface crack',
      severity: 'Low',
      status: 'Reported',
    },
    {
      lat: 18.5220,
      lng: 73.8390,
      title: 'Major Pothole - Swargate',
      description: 'Deep pothole affecting traffic flow',
      severity: 'Critical',
      status: 'Urgent',
    },
  ]

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
                View all reported road issues in real-time. Track status, severity, and resolution progress across Pune.
              </p>
            </motion.div>
          </div>
        </section>

        {/* View Mode Toggle */}
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
                <div className="h-5 w-5 rounded-full bg-red-600 ring-2 ring-white shadow-md" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-orange-600 ring-2 ring-white shadow-md" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-yellow-500 ring-2 ring-white shadow-md" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-green-500 ring-2 ring-white shadow-md" />
                <span>Low</span>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="p-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden shadow-lg">
              <ErrorBoundary fallbackMessage="Unable to load map. Please refresh the page.">
                <div style={{ height: '600px' }}>
                  <Map 
                    center={[18.5204, 73.8567]} 
                    zoom={13}
                    markers={potholeMarkers}
                    showHeatmap={viewMode === 'heatmap'}
                    height="600px"
                  />
                </div>
              </ErrorBoundary>
            </Card>

            {/* View Info */}
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {viewMode === 'markers' ? (
                <p>
                  Viewing {potholeMarkers.length} reported issues as markers. 
                  Click on any marker to see details.
                </p>
              ) : (
                <p>
                  Viewing density heatmap. Areas with more intense colors indicate higher severity or concentration of issues.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold">Issue Statistics</h2>
              <p className="mt-2 text-muted-foreground">Current status of reported road issues</p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6 text-center transition-all hover:shadow-lg">
                <div className="text-4xl font-bold text-red-600">
                  {potholeMarkers.filter(m => m.severity === 'Critical').length}
                </div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">Critical Issues</div>
                <div className="mt-1 text-xs text-muted-foreground">Requires immediate attention</div>
              </Card>
              
              <Card className="p-6 text-center transition-all hover:shadow-lg">
                <div className="text-4xl font-bold text-orange-600">
                  {potholeMarkers.filter(m => m.severity === 'High').length}
                </div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">High Priority</div>
                <div className="mt-1 text-xs text-muted-foreground">Action needed soon</div>
              </Card>
              
              <Card className="p-6 text-center transition-all hover:shadow-lg">
                <div className="text-4xl font-bold text-yellow-600">
                  {potholeMarkers.filter(m => m.severity === 'Medium').length}
                </div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">Medium Priority</div>
                <div className="mt-1 text-xs text-muted-foreground">Scheduled for repair</div>
              </Card>
              
              <Card className="p-6 text-center transition-all hover:shadow-lg">
                <div className="text-4xl font-bold text-green-600">
                  {potholeMarkers.filter(m => m.severity === 'Low').length}
                </div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">Low Priority</div>
                <div className="mt-1 text-xs text-muted-foreground">Monitoring status</div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-slate-50 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-2xl font-bold">Report a Road Issue</h2>
              <p className="mb-6 text-muted-foreground">
                See a pothole or road damage? Help make our roads safer by reporting it.
              </p>
              <Button size="lg" className="group">
                <MapPin className="mr-2 h-4 w-4" />
                Report New Issue
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
