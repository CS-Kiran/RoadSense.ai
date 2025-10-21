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
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '@/api/axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Create custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const InteractiveMapPage = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    severity: 'all'
  });
  const [mapView, setMapView] = useState('markers');
  const [userLocation, setUserLocation] = useState([28.6139, 77.2090]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    getUserLocation();
    fetchReports();
  }, [filters]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.severity !== 'all' && { severity: filters.severity }),
        includeLocation: true
      });

      const response = await axios.get(`/reports/nearby?${params}`);
      setReports(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#F59E0B',
      acknowledged: '#3B82F6',
      inprogress: '#8B5CF6',
      resolved: '#10B981',
      rejected: '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        gradient: 'from-amber-500 to-orange-600'
      },
      acknowledged: {
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        gradient: 'from-blue-500 to-blue-600'
      },
      inprogress: {
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        gradient: 'from-purple-500 to-purple-600'
      },
      resolved: {
        color: 'bg-green-100 text-green-700 border-green-200',
        gradient: 'from-green-500 to-green-600'
      },
      rejected: {
        color: 'bg-red-100 text-red-700 border-red-200',
        gradient: 'from-red-500 to-red-600'
      }
    };
    return configs[status] || configs.pending;
  };

  const clearFilters = () => {
    setFilters({ category: 'all', status: 'all', severity: 'all' });
  };

  const hasActiveFilters = filters.category !== 'all' || filters.status !== 'all' || filters.severity !== 'all';

  const filteredReports = reports.filter(report => {
    if (filters.category !== 'all' && report.categoryname !== filters.category) return false;
    if (filters.status !== 'all' && report.status !== filters.status) return false;
    if (filters.severity !== 'all') {
      if (filters.severity === 'high' && report.severity < 7) return false;
      if (filters.severity === 'medium' && (report.severity < 4 || report.severity >= 7)) return false;
      if (filters.severity === 'low' && report.severity >= 4) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <MapPin size={32} />
              <h1 className="text-3xl font-bold">Interactive Map</h1>
            </div>
            <p className="text-green-100 text-lg">
              View and explore nearby road issues in real-time
            </p>
          </div>
          <Link to="/citizen/report-issue">
            <Button className="bg-white text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
              <Plus size={20} className="mr-2" />
              Report Issue
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Controls */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Filter className="text-blue-600" size={20} />
            <h3 className="font-semibold text-gray-900">Filters & View</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <X size={14} className="mr-1" />
                Clear All
              </Button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={mapView === 'markers' ? 'default' : 'outline'}
              onClick={() => setMapView('markers')}
              size="sm"
              className={mapView === 'markers' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : ''}
            >
              <MapPin size={16} className="mr-1" />
              Markers
            </Button>
            <Button
              variant={mapView === 'heatmap' ? 'default' : 'outline'}
              onClick={() => setMapView('heatmap')}
              size="sm"
              className={mapView === 'heatmap' ? 'bg-gradient-to-r from-purple-600 to-purple-700' : ''}
            >
              <Layers size={16} className="mr-1" />
              Heatmap
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Categories</option>
            <option value="pothole">Pothole</option>
            <option value="crack">Crack</option>
            <option value="flooding">Flooding</option>
            <option value="signage">Signage</option>
            <option value="lighting">Street Lighting</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="inprogress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Severity Filter */}
          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Severity</option>
            <option value="high">High (7-10)</option>
            <option value="medium">Medium (4-6)</option>
            <option value="low">Low (1-3)</option>
          </select>
        </div>
      </Card>

      {/* Map Container */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <div style={{ height: '600px', width: '100%', position: 'relative' }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600 font-medium">Loading map data...</p>
            </div>
          ) : (
            <MapContainer
              center={userLocation}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User Location */}
              <Marker
                position={userLocation}
                icon={createCustomIcon('#3B82F6')}
              >
                <Popup>
                  <div className="p-2 text-center">
                    <Navigation className="mx-auto mb-2 text-blue-600" size={24} />
                    <p className="font-semibold text-gray-900">Your Location</p>
                    <p className="text-xs text-gray-600 mt-1">Current position</p>
                  </div>
                </Popup>
              </Marker>

              {/* Report Markers */}
              {mapView === 'markers' && filteredReports.map((report) => {
                if (!report.location?.coordinates) return null;
                const [lng, lat] = report.location.coordinates;
                const statusConfig = getStatusConfig(report.status);

                return (
                  <Marker
                    key={report.id}
                    position={[lat, lng]}
                    icon={createCustomIcon(getStatusColor(report.status))}
                    eventHandlers={{
                      click: () => setSelectedReport(report)
                    }}
                  >
                    <Popup maxWidth={300}>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${statusConfig.color} border text-xs`}>
                            {report.status.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {report.reportnumber}
                          </span>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-2">
                          {report.title}
                        </h3>

                        <p className="text-sm text-gray-600 mb-2">
                          {report.categoryname}
                        </p>

                        {report.reportmedia && report.reportmedia[0] && (
                          <img
                            src={report.reportmedia[0].thumbnailurl || report.reportmedia[0].fileurl}
                            alt="Report"
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}

                        <Link to={`/citizen/reports/${report.id}`}>
                          <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Heatmap Circles */}
              {mapView === 'heatmap' && filteredReports.map((report) => {
                if (!report.location?.coordinates) return null;
                const [lng, lat] = report.location.coordinates;
                const radius = report.severity >= 7 ? 300 : report.severity >= 4 ? 200 : 150;

                return (
                  <Circle
                    key={report.id}
                    center={[lat, lng]}
                    radius={radius}
                    pathOptions={{
                      color: getStatusColor(report.status),
                      fillColor: getStatusColor(report.status),
                      fillOpacity: 0.3,
                      weight: 2
                    }}
                  />
                );
              })}
            </MapContainer>
          )}
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center">
          <Activity className="mr-2 text-blue-600" size={20} />
          Map Legend
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-amber-500 shadow-md"></div>
            <span className="text-sm font-medium text-gray-700">Pending</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-blue-500 shadow-md"></div>
            <span className="text-sm font-medium text-gray-700">Acknowledged</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-purple-500 shadow-md"></div>
            <span className="text-sm font-medium text-gray-700">In Progress</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-green-500 shadow-md"></div>
            <span className="text-sm font-medium text-gray-700">Resolved</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-md"></div>
            <span className="text-sm font-medium text-gray-700">Rejected</span>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all group">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <MapPin className="text-white" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{filteredReports.length}</p>
          <p className="text-sm text-gray-600 mt-1">Total Issues</p>
        </Card>

        <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all group">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="text-white" size={24} />
          </div>
          <p className="text-3xl font-bold text-amber-600">
            {filteredReports.filter(r => r.status === 'pending').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Pending</p>
        </Card>

        <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all group">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Activity className="text-white" size={24} />
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {filteredReports.filter(r => r.status === 'inprogress').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">In Progress</p>
        </Card>

        <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all group">
          <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <MapPin className="text-white" size={24} />
          </div>
          <p className="text-3xl font-bold text-green-600">
            {filteredReports.filter(r => r.status === 'resolved').length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Resolved</p>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveMapPage;