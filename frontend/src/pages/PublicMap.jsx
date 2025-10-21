// src/pages/PublicMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Layers, 
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '@/components/layout/Navbar';

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

export default function PublicMap() {
  const [viewMode, setViewMode] = useState('markers');
  const [filterStatus, setFilterStatus] = useState('all');
  const [potholeMarkers, setPotholeMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const centerPosition = [18.5204, 73.8567]; // Pune coordinates

  useEffect(() => {
    // Mock data for demonstration
    const mockData = [
      { id: 1, lat: 18.5204, lng: 73.8567, status: 'pending', title: 'Pothole on Main Road', severity: 7 },
      { id: 2, lat: 18.5304, lng: 73.8667, status: 'inprogress', title: 'Crack near Junction', severity: 5 },
      { id: 3, lat: 18.5104, lng: 73.8467, status: 'resolved', title: 'Fixed Road Damage', severity: 3 },
      { id: 4, lat: 18.5404, lng: 73.8767, status: 'pending', title: 'Large Pothole', severity: 9 },
    ];
    setPotholeMarkers(mockData);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#F59E0B',
      inprogress: '#8B5CF6',
      resolved: '#10B981',
    };
    return colors[status] || '#6B7280';
  };

  const filteredMarkers = filterStatus === 'all' 
    ? potholeMarkers 
    : potholeMarkers.filter(m => m.status === filterStatus);

  const stats = {
    total: potholeMarkers.length,
    pending: potholeMarkers.filter(m => m.status === 'pending').length,
    inprogress: potholeMarkers.filter(m => m.status === 'inprogress').length,
    resolved: potholeMarkers.filter(m => m.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2">
              Public Access
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Public Road Issues Map
            </h1>
            <p className="text-xl text-white/90 mb-6">
              View all reported road issues in real-time. Track status, severity, and resolution progress across Pune.
            </p>
            <div className="flex items-center gap-4 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                {filteredMarkers.length} issues visible
              </span>
              <span>•</span>
              <span>Updated in real-time</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="grid lg:grid-cols-4 gap-6 mb-6">
          {/* View Mode Toggle */}
          <Card className="p-4 border-0 shadow-lg lg:col-span-2">
            <div className="flex items-center gap-3">
              <Layers className="text-blue-600" size={20} />
              <div className="flex-1 flex gap-2">
                <Button
                  variant={viewMode === 'markers' ? 'default' : 'outline'}
                  onClick={() => setViewMode('markers')}
                  size="sm"
                  className={viewMode === 'markers' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : ''}
                >
                  <MapPin size={16} className="mr-1" />
                  Markers
                </Button>
                <Button
                  variant={viewMode === 'heatmap' ? 'default' : 'outline'}
                  onClick={() => setViewMode('heatmap')}
                  size="sm"
                  className={viewMode === 'heatmap' ? 'bg-gradient-to-r from-purple-600 to-purple-700' : ''}
                >
                  <Layers size={16} className="mr-1" />
                  Heatmap
                </Button>
              </div>
            </div>
          </Card>

          {/* Status Filter */}
          <Card className="p-4 border-0 shadow-lg lg:col-span-2">
            <div className="flex items-center gap-3">
              <Filter className="text-blue-600" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              {filterStatus !== 'all' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Map Container */}
        <Card className="overflow-hidden border-0 shadow-xl mb-6">
          <div style={{ height: '600px', width: '100%', position: 'relative' }}>
            {loading ? (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            ) : (
              <MapContainer
                center={centerPosition}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {viewMode === 'markers' && filteredMarkers.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={[marker.lat, marker.lng]}
                    icon={createCustomIcon(getStatusColor(marker.status))}
                  >
                    <Popup maxWidth={300}>
                      <div className="p-3">
                        <h3 className="font-bold text-gray-900 mb-2">
                          {marker.title}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <Badge className={`${
                            marker.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            marker.status === 'inprogress' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            'bg-green-100 text-green-700 border-green-200'
                          } border`}>
                            {marker.status.toUpperCase()}
                          </Badge>
                          <p className="text-gray-600">Severity: {marker.severity}/10</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {viewMode === 'heatmap' && filteredMarkers.map((marker) => (
                  <Circle
                    key={marker.id}
                    center={[marker.lat, marker.lng]}
                    radius={marker.severity >= 7 ? 300 : marker.severity >= 4 ? 200 : 150}
                    pathOptions={{
                      color: getStatusColor(marker.status),
                      fillColor: getStatusColor(marker.status),
                      fillOpacity: 0.3,
                      weight: 2
                    }}
                  />
                ))}
              </MapContainer>
            )}
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Statistics */}
          <Card className="p-8 border-0 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="mr-2 text-blue-600" size={24} />
              Issue Statistics
            </h2>
            <p className="text-gray-600 mb-6">Current status of reported road issues</p>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Issues', value: stats.total, icon: MapPin, color: 'from-blue-500 to-blue-600' },
                { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-600' },
                { label: 'In Progress', value: stats.inprogress, icon: AlertCircle, color: 'from-purple-500 to-purple-600' },
                { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'from-green-500 to-green-600' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl">
                    <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3 shadow-md`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* CTA Card */}
          <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <AlertCircle size={48} className="mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Report a Road Issue
            </h2>
            <p className="text-white/90 mb-6">
              See a pothole or road damage? Help make our roads safer by reporting it.
            </p>
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl w-full group"
              >
                <Plus className="mr-2 group-hover:rotate-90 transition-transform" size={20} />
                <span>Report Issue</span>
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}