import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Map, { getUserLocation } from "@/components/Map/Map";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useState, useEffect } from "react";
import { MapPin, AlertCircle, Info } from "lucide-react";

// Helper function to calculate distance
function calculateDistance(point1, point2) {
  const R = 6371;
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLon = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapSection() {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([18.5204, 73.8567]);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    // Simple timeout to prevent hanging
    const timeout = setTimeout(() => {
      setIsLoadingLocation(false);
    }, 5000);

    if (navigator.geolocation) {
      getUserLocation(
        (location) => {
          setUserLocation(location);
          setMapCenter([location.lat, location.lng]);
          setIsLoadingLocation(false);
          clearTimeout(timeout);
        },
        (error) => {
          console.error("Location error:", error);
          setLocationError(error);
          setIsLoadingLocation(false);
          clearTimeout(timeout);
        }
      );
    } else {
      setIsLoadingLocation(false);
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, []);

  const officeMarkers = [
    {
      lat: 18.5204,
      lng: 73.8567,
      title: "RoadSense.ai Office",
      description: "Pune, Maharashtra, India",
    },
  ];

  return (
    <section className="border-t bg-slate-50 py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Find Us on the Map</h2>
          <p className="mb-4 text-muted-foreground">
            Located in the heart of Pune, Maharashtra.
          </p>

          {/* Loading State */}
          {isLoadingLocation && !locationError && (
            <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              <Info className="mr-2 inline h-4 w-4" />
              Detecting your location...
            </div>
          )}

          <Card className="overflow-hidden shadow-lg">
            <ErrorBoundary fallbackMessage="Unable to load the map. Please refresh the page.">
              <div style={{ height: "450px" }}>
                <Map
                  center={mapCenter}
                  zoom={13}
                  markers={officeMarkers}
                  showUserLocation={!locationError}
                  onLocationFound={(latlng) => {
                    console.log("Location found:", latlng);
                  }}
                  height="450px"
                />
              </div>
            </ErrorBoundary>
          </Card>

          <p className="mt-4 text-xs text-muted-foreground">
            {locationError
              ? "Enable location services to see your distance from us."
              : "We respect your privacy and do not store location data."}
          </p>
        </div>
      </div>
    </section>
  );
}
