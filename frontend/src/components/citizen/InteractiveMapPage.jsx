import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Filter,
  MapPin,
  Layers,
  Navigation,
  Loader2,
  Plus,
  X,
  TrendingUp,
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '@/api/axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Severity color helper
const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return '#991b1b';
    case 'high':
      return '#c2410c';
    case 'medium':
      return '#ca8a04';
    case 'low':
      return '#15803d';
    default:
      return '#1e40af';
  }
};

// Severity class helper
function getSeverityClass(severity) {
  switch (severity?.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Simple Heatmap component
function SimpleHeatmap({ points }) {
  if (!points || points.length === 0) return null;

  return (
    <>
      {points.map((point, idx) => {
        const color = getSeverityColor(point.severity);
        const radiusMap = {
          critical: 300,
          high: 250,
          medium: 200,
          low: 150,
        };
        const radius = radiusMap[point.severity?.toLowerCase()] || 200;

        return (
          <Circle
            key={idx}
            center={[point.latitude, point.longitude]}
            radius={radius}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.2,
              color: color,
              weight: 1,
              opacity: 0.4,
            }}
          />
        );
      })}
    </>
  );
}

const InteractiveMapPage = () => {
  // State management
  const [userPosition, setUserPosition] = useState(null);
  const [defaultCenter, setDefaultCenter] = useState([20.5937, 78.9629]); // India center
  const [loading, setLoading] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [reports, setReports] = useState([]);

  const [filters, setFilters] = useState({
    severity: [],
    status: [],
    issueType: [],
    showHeatmap: false,
  });

  // Get user location on mount with proper error handling
  useEffect(() => {
    getUserLocation();
  }, []);

  // Fetch reports when component mounts (even without location)
  useEffect(() => {
    fetchReports();
  }, [userPosition]);

  const getUserLocation = () => {
    setLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserPosition(pos);
        setDefaultCenter([pos.lat, pos.lng]);
        setLoading(false);
        setLocationError(null);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLoading(false);

        // Handle different error codes
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable location permissions in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Make sure location services are enabled on your device and you have a stable GPS/WiFi connection.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while trying to get your location.';
        }
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout to 15 seconds
        maximumAge: 0,
      }
    );
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const token = localStorage.getItem('token');

      // Build query params
      const params = new URLSearchParams();
      if (userPosition) {
        params.append('latitude', userPosition.lat);
        params.append('longitude', userPosition.lng);
        params.append('radius_km', '50');
      }

      const response = await axios.get(`/api/reports?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setReports(response.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const currentValues = prev[category];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return { ...prev, [category]: newValues };
    });
  };

  const clearFilters = () => {
    setFilters({
      severity: [],
      status: [],
      issueType: [],
      showHeatmap: false,
    });
  };

  // Filter reports
  const filteredReports = reports.filter((report) => {
    if (filters.severity.length > 0 && !filters.severity.includes(report.severity?.toLowerCase())) {
      return false;
    }
    if (filters.status.length > 0 && !filters.status.includes(report.status?.toLowerCase())) {
      return false;
    }
    if (filters.issueType.length > 0 && !filters.issueType.includes(report.issue_type?.toLowerCase())) {
      return false;
    }
    return true;
  });

  const hasActiveFilters =
    filters.severity.length > 0 || filters.status.length > 0 || filters.issueType.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Interactive Map</h1>
              <p className="text-slate-600">View and explore nearby road issues in real-time</p>
              {userPosition && (
                <div className="mt-2 flex items-start gap-2 text-sm text-green-600">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    ✓ Location: {userPosition.lat.toFixed(4)}, {userPosition.lng.toFixed(4)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={getUserLocation} variant="outline" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4 mr-2" />
                )}
                Detect Location
              </Button>
              <Button onClick={fetchReports} variant="outline" disabled={loadingReports}>
                {loadingReports ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
              <Link to="/citizen/report-issue">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </Link>
            </div>
          </div>

          {/* Location Loading Banner */}
          {loading && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">Detecting your location...</p>
                  <p className="text-sm text-blue-700">This may take a few seconds. Please wait...</p>
                </div>
              </div>
            </div>
          )}

          {/* Location Error Banner */}
          {locationError && (
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-orange-900">Unable to detect location</p>
                  <p className="text-sm text-orange-700 mt-1">{locationError}</p>
                  <p className="text-sm text-orange-600 mt-2">
                    <strong>Troubleshooting:</strong>
                  </p>
                  <ul className="text-sm text-orange-600 mt-1 ml-4 list-disc">
                    <li>Enable location services on your device</li>
                    <li>Check if WiFi or GPS is working</li>
                    <li>Allow location access in browser settings</li>
                    <li>Try using a different browser</li>
                  </ul>
                  <p className="text-sm text-slate-600 mt-3">
                    📍 <strong>Note:</strong> The map will show reports from India. You can still browse and report issues.
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={getUserLocation}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="p-6 h-fit shadow-xl border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Severity Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Severity</h4>
              <div className="space-y-2">
                {['critical', 'high', 'medium', 'low'].map((severity) => (
                  <label key={severity} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.severity.includes(severity)}
                      onChange={() => toggleFilter('severity', severity)}
                      className="rounded"
                    />
                    <Badge variant="outline" className={getSeverityClass(severity)}>
                      {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Status</h4>
              <div className="space-y-2">
                {['pending', 'in_progress', 'resolved', 'closed'].map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => toggleFilter('status', status)}
                      className="rounded"
                    />
                    <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Issue Type Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Issue Type</h4>
              <div className="space-y-2">
                {['pothole', 'crack', 'debris', 'street_light', 'drainage', 'other'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.issueType.includes(type)}
                      onChange={() => toggleFilter('issueType', type)}
                      className="rounded"
                    />
                    <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Heatmap Toggle */}
            <div className="pt-4 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.showHeatmap}
                  onChange={() => setFilters((prev) => ({ ...prev, showHeatmap: !prev.showHeatmap }))}
                  className="rounded"
                />
                <Layers className="w-4 h-4" />
                <span className="text-sm font-medium">Show Heatmap</span>
              </label>
            </div>
          </Card>

          {/* Map Container */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Total Issues</p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">{filteredReports.length}</p>
                  </div>
                  <Activity className="w-10 h-10 text-blue-600 opacity-50" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-700 font-medium">Pending</p>
                    <p className="text-3xl font-bold text-yellow-900 mt-1">
                      {filteredReports.filter((r) => r.status === 'pending').length}
                    </p>
                  </div>
                  <AlertCircle className="w-10 h-10 text-yellow-600 opacity-50" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700 font-medium">In Progress</p>
                    <p className="text-3xl font-bold text-orange-900 mt-1">
                      {filteredReports.filter((r) => r.status === 'in_progress').length}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-orange-600 opacity-50" />
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Resolved</p>
                    <p className="text-3xl font-bold text-green-900 mt-1">
                      {filteredReports.filter((r) => r.status === 'resolved').length}
                    </p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-green-600 opacity-50" />
                </div>
              </Card>
            </div>

            {/* Map Card */}
            <Card className="p-8 shadow-xl border-0">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Road Issues Map</h2>
                <p className="text-slate-600">
                  {userPosition
                    ? 'Showing issues near your location'
                    : 'Showing issues from India'}
                </p>
              </div>

              {/* Map Container - Always renders, even without user location */}
              <div className="relative rounded-xl overflow-hidden border-4 border-slate-200 shadow-lg">
                <MapContainer
                  center={defaultCenter}
                  zoom={userPosition ? 13 : 5}
                  className="h-[500px] w-full"
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* User Location Marker */}
                  {userPosition && (
                    <Marker position={[userPosition.lat, userPosition.lng]}>
                      <Popup>
                        <div className="p-2">
                          <p className="font-semibold text-blue-900 mb-1">📍 Your Location</p>
                          <p className="text-xs text-slate-500">
                            {userPosition.lat.toFixed(6)}, {userPosition.lng.toFixed(6)}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Heatmap Circles */}
                  {filters.showHeatmap && <SimpleHeatmap points={filteredReports} />}

                  {/* Report Markers */}
                  {!filters.showHeatmap &&
                    filteredReports.map((report) => (
                      <Marker key={report.id} position={[report.latitude, report.longitude]}>
                        <Popup maxWidth={300}>
                          <div className="p-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="font-bold text-slate-900 text-base leading-tight">
                                {report.title}
                              </h4>
                              {report.severity && (
                                <Badge variant="outline" className={getSeverityClass(report.severity)}>
                                  {report.severity}
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{report.description}</p>

                            {report.status && (
                              <p className="text-xs text-slate-500 mb-2">
                                <strong>Status:</strong> {report.status}
                              </p>
                            )}

                            <Link to={`/citizen/reports/${report.id}`}>
                              <Button size="sm" className="w-full mt-2">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                </MapContainer>

                {/* Map Info Banner */}
                <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700">
                      {userPosition ? (
                        <strong>Blue marker shows your location</strong>
                      ) : (
                        <strong>Click "Detect Location" to center map on your position</strong>
                      )}
                    </p>
                  </div>
                </div>

                {/* Loading Overlay */}
                {loadingReports && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[999]">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
                      <p className="text-slate-700 font-medium">Loading reports...</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapPage;