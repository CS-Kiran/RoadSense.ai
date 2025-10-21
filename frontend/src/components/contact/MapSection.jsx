// src/components/contact/MapSection.jsx
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Map, { getUserLocation } from "@/components/Map/Map";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useState, useEffect } from "react";
import { MapPin, AlertCircle, Info, Navigation } from "lucide-react";
import { motion } from "framer-motion";

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
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-purple-100 text-purple-600 border-purple-200 px-4 py-2">
            <MapPin size={14} className="mr-2 inline" />
            Our Location
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Find Us on the Map
          </h2>
          <p className="text-xl text-gray-600">
            Located in the heart of Pune, Maharashtra
          </p>
        </motion.div>

        {/* Map Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden border-0 shadow-xl">
            {/* Loading State */}
            {isLoadingLocation && !locationError && (
              <Alert className="m-6 border-blue-200 bg-blue-50">
                <Navigation className="h-4 w-4 text-blue-600 animate-pulse" />
                <AlertDescription className="text-blue-700 font-medium">
                  Detecting your location...
                </AlertDescription>
              </Alert>
            )}

            {/* Map */}
            <ErrorBoundary>
              <Map
                markers={officeMarkers}
                center={mapCenter}
                zoom={13}
                onMarkerClick={(latlng) => {
                  console.log("Location found:", latlng);
                }}
                height="500px"
              />
            </ErrorBoundary>

            {/* Map Footer */}
            <div className="p-6 bg-white border-t border-gray-200">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    {locationError
                      ? "Enable location services to see your distance from us"
                      : "We respect your privacy and do not store location data"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Click on the marker to get directions via Google Maps
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Office Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="p-8 border-0 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Address</h3>
                <p className="text-sm text-gray-600">
                  Pune, Maharashtra<br />
                  India 411001
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Navigation className="text-green-600" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Directions</h3>
                <p className="text-sm text-gray-600">
                  Easily accessible by<br />
                  public transport
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <AlertCircle className="text-purple-600" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Parking</h3>
                <p className="text-sm text-gray-600">
                  Visitor parking<br />
                  available on-site
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}