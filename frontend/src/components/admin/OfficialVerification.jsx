import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCheck, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import axios from '@/api/axios';

const OfficialVerification = () => {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingOfficials();
  }, []);

  const fetchPendingOfficials = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/officials/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOfficials(response.data);
    } catch (error) {
      console.error('Error fetching officials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (officialId, action) => {
    setProcessing(officialId);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `/api/admin/officials/${officialId}/verify`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Remove from list
      setOfficials(officials.filter((o) => o.id !== officialId));
    } catch (error) {
      console.error('Error verifying official:', error);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <UserCheck className="w-8 h-8" />
          Official Verification
        </h1>
        <p className="text-slate-600 mt-1">Review and verify pending officials</p>
      </div>

      {officials.length === 0 ? (
        <Card className="p-12 text-center">
          <UserCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">No pending officials to verify</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {officials.map((official) => (
            <Card key={official.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {official.full_name}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-600">Email</p>
                      <p className="font-medium">{official.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Phone</p>
                      <p className="font-medium">{official.phone_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Employee ID</p>
                      <p className="font-medium">{official.employee_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Department</p>
                      <p className="font-medium">{official.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Designation</p>
                      <p className="font-medium">{official.designation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Zone</p>
                      <p className="font-medium">{official.zone}</p>
                    </div>
                  </div>
                  {official.government_id_url && (
                    <a
                      href={official.government_id_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm"
                    >
                      View Government ID
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleVerify(official.id, 'approve')}
                    disabled={processing === official.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {processing === official.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleVerify(official.id, 'reject')}
                    disabled={processing === official.id}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfficialVerification;
