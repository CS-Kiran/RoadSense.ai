import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const getSeverityColor = (severity) => {
  switch (severity) {
    case "Critical":
      return "#991b1b";
    case "High":
      return "#c2410c";
    case "Medium":
      return "#ca8a04";
    case "Low":
      return "#15803d";
    default:
      return "#1e40af";
  }
};

function getSeverityClass(severity) {
  switch (severity?.toLowerCase()) {
    case "high":
    case "critical":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function SimpleHeatmap({ points }) {
  if (!points || points.length === 0) return null;

  return (
    <>
      {points.map((point, idx) => {
        const color = getSeverityColor(point.severity);
        const radiusMap = {
          Critical: 300,
          High: 250,
          Medium: 200,
          Low: 150,
        };
        const radius = radiusMap[point.severity] || 200;

        return (
          <Circle
            key={`heat-${idx}`}
            center={[point.lat, point.lng]}
            radius={radius}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.7,
              color: color,
              opacity: 0.8,
              weight: 3,
            }}
          />
        );
      })}
    </>
  );
}

export default function Map({
  center = [18.5204, 73.8567],
  zoom = 13,
  markers = [],
  showHeatmap = false,
  height = "400px",
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        style={{ height, width: "100%" }}
        className="flex items-center justify-center bg-slate-100 rounded-lg"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height, width: "100%"  }} className="px-8">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showHeatmap ? (
          <SimpleHeatmap points={markers} />
        ) : (
          markers &&
          markers.length > 0 &&
          markers.map((marker, idx) => (
            <Marker
              key={`marker-${idx}`}
              position={[marker.lat, marker.lng]}
              icon={L.divIcon({
                className: "custom-severity-marker",
                html: `<div style="width:32px;height:32px;background:${getSeverityColor(
                  marker.severity
                )};border-radius:50%;border:3px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.5);"></div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -16],
              })}
            >
              <Popup>
                <div className="text-sm">
                  <strong className="text-base">{marker.title}</strong>
                  {marker.description && (
                    <p className="mt-1 text-xs text-gray-600">
                      {marker.description}
                    </p>
                  )}
                  {marker.severity && (
                    <span
                      className={`mt-2 inline-block rounded px-2 py-1 text-xs font-semibold ${getSeverityClass(
                        marker.severity
                      )}`}
                    >
                      {marker.severity}
                    </span>
                  )}
                  {marker.status && (
                    <p className="mt-1 text-xs text-gray-500">
                      <strong>Status:</strong> {marker.status}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
}

export const getUserLocation = (onSuccess, onError) => {
  if (!navigator.geolocation) {
    const error = new Error("Geolocation not supported");
    error.code = 0;
    if (onError) onError(error);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (onSuccess) {
        onSuccess({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      }
    },
    (error) => {
      if (onError) onError(error);
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000,
    }
  );
};
