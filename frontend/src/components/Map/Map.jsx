import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

// Component to locate user
function LocateUser({ onLocationFound }) {
  const map = useMap()
  
  useEffect(() => {
    map.locate({ setView: false, maxZoom: 16 }).on('locationfound', function (e) {
      if (onLocationFound) {
        onLocationFound(e.latlng, e.accuracy)
      }
    })
  }, [map, onLocationFound])

  return null
}

// Main Map Component
export default function Map({
  center = [18.5204, 73.8567],
  zoom = 13,
  markers = [],
  showUserLocation = false,
  onLocationFound,
  height = '400px',
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) {
    return (
      <div 
        style={{ height, width: '100%' }} 
        className="flex items-center justify-center bg-slate-100 rounded-lg"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height, width: '100%' }}
      className="rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {showUserLocation && <LocateUser onLocationFound={onLocationFound} />}

      {markers.map((marker, idx) => (
        <Marker key={idx} position={[marker.lat, marker.lng]}>
          <Popup>
            <div className="text-sm">
              <strong>{marker.title}</strong>
              {marker.description && <p className="mt-1">{marker.description}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const getUserLocation = (onSuccess, onError) => {
  if (!navigator.geolocation) {
    const error = new Error('Geolocation not supported')
    error.code = 0
    onError?.(error)
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      onSuccess({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      })
    },
    (error) => {
      onError?.(error)
    },
    {
      enableHighAccuracy: false, // Change to false for better compatibility
      timeout: 10000,
      maximumAge: 60000 // Cache position for 1 minute
    }
  )
}
