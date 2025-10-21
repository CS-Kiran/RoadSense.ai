import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Mail, Phone, Building2, MapPin, FileText, Calendar, Shield, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isOfficial = user.role === 'official';

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user.full_name}!</p>
          </div>
          <Button onClick={logout} variant="outline" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </motion.div>

        {/* Account Status Alert */}
        {user.account_status === 'pending' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                <strong>Account Pending:</strong> Your account is awaiting admin approval. You will be notified once verified.
              </p>
            </div>
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{user.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.role === 'official' ? 'Government Official' : 'Citizen'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.account_status)}`}>
                  {user.account_status.charAt(0).toUpperCase() + user.account_status.slice(1)}
                </span>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-3 ml-7">
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                    
                    {user.phone_number && (
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">{user.phone_number}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Official Information (if official) */}
                {isOfficial && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Official Details
                    </h3>
                    
                    <div className="space-y-3 ml-7">
                      {user.employee_id && (
                        <div>
                          <p className="text-xs text-muted-foreground">Employee ID</p>
                          <p className="text-sm font-medium">{user.employee_id}</p>
                        </div>
                      )}
                      
                      {user.department && (
                        <div>
                          <p className="text-xs text-muted-foreground">Department</p>
                          <p className="text-sm font-medium">{user.department}</p>
                        </div>
                      )}
                      
                      {user.designation && (
                        <div>
                          <p className="text-xs text-muted-foreground">Designation</p>
                          <p className="text-sm font-medium">{user.designation}</p>
                        </div>
                      )}
                      
                      {user.zone && (
                        <div>
                          <p className="text-xs text-muted-foreground">Assigned Zone</p>
                          <p className="text-sm font-medium">{user.zone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Account Details
                  </h3>
                  
                  <div className="space-y-3 ml-7">
                    <div>
                      <p className="text-xs text-muted-foreground">User ID</p>
                      <p className="text-sm font-medium">#{user.id}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Member Since</p>
                      <p className="text-sm font-medium">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid md:grid-cols-3 gap-4"
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">My Reports</h3>
                <p className="text-sm text-muted-foreground mt-1">View your submissions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Nearby Issues</h3>
                <p className="text-sm text-muted-foreground mt-1">Explore local reports</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-center">
                <User className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Edit Profile</h3>
                <p className="text-sm text-muted-foreground mt-1">Update your details</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}