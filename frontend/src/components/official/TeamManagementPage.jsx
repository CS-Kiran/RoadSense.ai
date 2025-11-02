// src/pages/official/TeamManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Search,
  Loader2,
  AlertCircle,
  UserPlus,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Dummy team data with Indian names and locations
const DUMMY_TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@pwddelhi.gov.in',
    phone: '+91 98765 43210',
    designation: 'Senior Engineer',
    zone: 'Zone A - Central Delhi',
    status: 'active',
    reports_assigned: 12,
    reports_resolved: 8,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya.sharma@pwddelhi.gov.in',
    phone: '+91 98765 43211',
    designation: 'Junior Engineer',
    zone: 'Zone A - Central Delhi',
    status: 'active',
    reports_assigned: 8,
    reports_resolved: 5,
  },
  {
    id: 3,
    name: 'Amit Patel',
    email: 'amit.patel@pwddelhi.gov.in',
    phone: '+91 98765 43212',
    designation: 'Field Officer',
    zone: 'Zone A - Central Delhi',
    status: 'active',
    reports_assigned: 15,
    reports_resolved: 12,
  },
  {
    id: 4,
    name: 'Sunita Verma',
    email: 'sunita.verma@pwddelhi.gov.in',
    phone: '+91 98765 43213',
    designation: 'Assistant Engineer',
    zone: 'Zone B - South Delhi',
    status: 'active',
    reports_assigned: 10,
    reports_resolved: 7,
  },
  {
    id: 5,
    name: 'Vikram Singh',
    email: 'vikram.singh@pwddelhi.gov.in',
    phone: '+91 98765 43214',
    designation: 'Supervisor',
    zone: 'Zone A - Central Delhi',
    status: 'active',
    reports_assigned: 6,
    reports_resolved: 4,
  },
  {
    id: 6,
    name: 'Anjali Desai',
    email: 'anjali.desai@pwddelhi.gov.in',
    phone: '+91 98765 43215',
    designation: 'Technical Officer',
    zone: 'Zone C - East Delhi',
    status: 'active',
    reports_assigned: 9,
    reports_resolved: 6,
  },
  {
    id: 7,
    name: 'Manoj Gupta',
    email: 'manoj.gupta@pwddelhi.gov.in',
    phone: '+91 98765 43216',
    designation: 'Inspector',
    zone: 'Zone A - Central Delhi',
    status: 'active',
    reports_assigned: 11,
    reports_resolved: 9,
  },
  {
    id: 8,
    name: 'Kavita Reddy',
    email: 'kavita.reddy@pwddelhi.gov.in',
    phone: '+91 98765 43217',
    designation: 'Junior Engineer',
    zone: 'Zone D - West Delhi',
    status: 'active',
    reports_assigned: 7,
    reports_resolved: 4,
  },
];

const TeamManagementPage = () => {
  const { token } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [usingDummyData, setUsingDummyData] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingDummyData(false);

      const response = await axios.get(`${API_URL}/api/official/team`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.team_members && response.data.team_members.length > 0) {
        setTeamMembers(response.data.team_members);
      } else {
        setTeamMembers(DUMMY_TEAM_MEMBERS);
        setUsingDummyData(true);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError(err.response?.data?.detail || 'Failed to load team members');
      setTeamMembers(DUMMY_TEAM_MEMBERS);
      setUsingDummyData(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your team members and their assignments
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-blue-700">{teamMembers.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-green-700">
                {teamMembers.filter((m) => m.status === 'active').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assigned</p>
              <p className="text-2xl font-bold text-purple-700">
                {teamMembers.reduce((sum, m) => sum + (m.reports_assigned || 0), 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Resolved</p>
              <p className="text-2xl font-bold text-orange-700">
                {teamMembers.reduce((sum, m) => sum + (m.reports_resolved || 0), 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by name, designation, or zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredMembers.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{teamMembers.length}</span> members
        </div>
      </Card>

      {/* Team Members Grid */}
      {filteredMembers.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No team members found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-600">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.designation}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {member.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{member.zone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-600">Assigned</p>
                    <p className="font-semibold text-gray-900">{member.reports_assigned}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Resolved</p>
                    <p className="font-semibold text-green-600">{member.reports_resolved}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pending</p>
                    <p className="font-semibold text-amber-600">
                      {member.reports_assigned - member.reports_resolved}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Assign Report
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamManagementPage;
