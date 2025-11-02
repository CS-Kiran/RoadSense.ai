// src/pages/official/ZoneManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Users,
  FileText,
  TrendingUp,
  Loader2,
  AlertCircle,
  Map,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Dummy zones data for Indian cities
const DUMMY_ZONES = [
  {
    id: 1,
    name: 'Zone A - Central Delhi',
    description: 'Covers Connaught Place, Janpath, and surrounding areas',
    city: 'New Delhi',
    area_km2: 45.2,
    population: 250000,
    total_reports: 156,
    pending_reports: 32,
    in_progress: 45,
    resolved: 79,
    team_members: 12,
    status: 'active',
    priority_level: 'high',
  },
  {
    id: 2,
    name: 'Zone B - South Delhi',
    description: 'Covers Saket, Hauz Khas, Greater Kailash areas',
    city: 'New Delhi',
    area_km2: 52.8,
    population: 320000,
    total_reports: 189,
    pending_reports: 28,
    in_progress: 52,
    resolved: 109,
    team_members: 15,
    status: 'active',
    priority_level: 'high',
  },
  {
    id: 3,
    name: 'Zone C - East Delhi',
    description: 'Covers Laxmi Nagar, Preet Vihar, and nearby regions',
    city: 'New Delhi',
    area_km2: 38.5,
    population: 280000,
    total_reports: 134,
    pending_reports: 19,
    in_progress: 38,
    resolved: 77,
    team_members: 10,
    status: 'active',
    priority_level: 'medium',
  },
  {
    id: 4,
    name: 'Zone D - West Delhi',
    description: 'Covers Rajouri Garden, Janakpuri, and surrounding areas',
    city: 'New Delhi',
    area_km2: 41.3,
    population: 295000,
    total_reports: 142,
    pending_reports: 24,
    in_progress: 41,
    resolved: 77,
    team_members: 11,
    status: 'active',
    priority_level: 'medium',
  },
  {
    id: 5,
    name: 'Zone E - North Delhi',
    description: 'Covers Civil Lines, Kashmere Gate, and adjacent areas',
    city: 'New Delhi',
    area_km2: 35.7,
    population: 215000,
    total_reports: 98,
    pending_reports: 15,
    in_progress: 29,
    resolved: 54,
    team_members: 8,
    status: 'active',
    priority_level: 'low',
  },
];

const ZoneManagementPage = () => {
  const { token } = useAuth();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingDummyData, setUsingDummyData] = useState(false);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingDummyData(false);

      const response = await axios.get(`${API_URL}/api/official/zones`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.zones && response.data.zones.length > 0) {
        setZones(response.data.zones);
      } else {
        setZones(DUMMY_ZONES);
        setUsingDummyData(true);
      }
    } catch (err) {
      console.error('Error fetching zones:', err);
      setError(err.response?.data?.detail || 'Failed to load zones');
      setZones(DUMMY_ZONES);
      setUsingDummyData(true);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[priority] || colors.medium;
  };

  const totalStats = {
    total_zones: zones.length,
    total_reports: zones.reduce((sum, z) => sum + z.total_reports, 0),
    total_pending: zones.reduce((sum, z) => sum + z.pending_reports, 0),
    total_team: zones.reduce((sum, z) => sum + z.team_members, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zone Management</h1>
          <p className="text-gray-600 mt-2">Manage geographical zones and their operations</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Zone
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Zones</p>
              <p className="text-2xl font-bold text-blue-700">{totalStats.total_zones}</p>
            </div>
            <Map className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-purple-700">{totalStats.total_reports}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-amber-700">{totalStats.total_pending}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-green-700">{totalStats.total_team}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {zones.map((zone) => (
          <Card key={zone.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{zone.name}</h3>
                <p className="text-sm text-gray-600">{zone.description}</p>
              </div>
              <Badge className={`${getPriorityColor(zone.priority_level)} border`}>
                {zone.priority_level}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>
                  {zone.area_km2} km² • {(zone.population / 1000).toFixed(0)}K pop.
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{zone.team_members} team members</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Total</p>
                <p className="text-lg font-bold text-gray-900">{zone.total_reports}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Pending</p>
                <p className="text-lg font-bold text-amber-600">{zone.pending_reports}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Progress</p>
                <p className="text-lg font-bold text-purple-600">{zone.in_progress}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Resolved</p>
                <p className="text-lg font-bold text-green-600">{zone.resolved}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                View Reports
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Manage Team
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ZoneManagementPage;
