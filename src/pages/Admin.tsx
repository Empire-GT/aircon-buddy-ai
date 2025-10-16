import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users,
  Wrench,
  DollarSign,
  TrendingUp,
  Calendar,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  MessageCircle,
  UserPlus,
  Eye,
  BarChart3,
  Settings,
  User
} from "lucide-react";
import MessagingLayout from "@/components/MessagingLayout";
import TechnicianAssignmentModal from "@/components/TechnicianAssignmentModal";
import SubscriptionManagement from "@/components/SubscriptionManagement";
import UserManagement from "@/components/UserManagement";
import RolesPermissions from "@/components/RolesPermissions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Admin = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const handleSectionChange = (section: string) => {
    console.log('Admin section changing to:', section);
    setActiveSection(section);
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchBookings(),
      fetchTechnicians()
    ]);
    setLoading(false);
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services (name, category)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
  };

  const fetchTechnicians = async () => {
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('is_active', true);

    if (!error && data) {
      setTechnicians(data);
    }
  };

  const handleAssignTechnician = (booking: any) => {
    setSelectedBooking(booking);
    setIsAssignmentModalOpen(true);
  };

  const handleAssignmentComplete = () => {
    fetchBookings(); // Refresh bookings after assignment
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = [
    { 
      icon: DollarSign, 
      label: "Total Revenue", 
      value: "₱125,400", 
      change: "+12.5%",
      trend: 'up'
    },
    { 
      icon: Calendar, 
      label: "Total Bookings", 
      value: "1,247", 
      change: "+8.2%",
      trend: 'up'
    },
    { 
      icon: Users, 
      label: "Active Technicians", 
      value: "24", 
      change: "+2",
      trend: 'up'
    },
    { 
      icon: Star, 
      label: "Average Rating", 
      value: "4.8", 
      change: "+0.1",
      trend: 'up'
    },
  ];

  const recentBookings = [
    { 
      id: "1", 
      customer: "Maria Santos", 
      service: "AC Cleaning",
      technician: "Juan Cruz",
      status: "Completed",
      amount: "₱800"
    },
    { 
      id: "2", 
      customer: "John Doe", 
      service: "AC Repair",
      technician: "Pedro Gomez",
      status: "In Progress",
      amount: "₱1,200"
    },
    { 
      id: "3", 
      customer: "Ana Lopez", 
      service: "General Cleaning",
      technician: "Carlos Tan",
      status: "Completed",
      amount: "₱500"
    },
  ];

  const topTechnicians = [
    { name: "Juan Cruz", rating: 4.9, jobs: 127, earnings: "₱38,200" },
    { name: "Pedro Gomez", rating: 4.8, jobs: 98, earnings: "₱31,400" },
    { name: "Carlos Tan", rating: 4.9, jobs: 115, earnings: "₱34,500" },
    { name: "Miguel Reyes", rating: 4.7, jobs: 89, earnings: "₱26,700" },
  ];

  const renderActiveSection = () => {
    console.log('Rendering active section:', activeSection);
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Welcome back! Here's an overview of your business performance and key metrics.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-large transition-all duration-300 border-2">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-accent rounded-lg">
                        <Icon className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-semibold ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="h-4 w-4" />
                        {stat.change}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setActiveSection('bookings')}
                >
                  <Calendar className="h-6 w-6" />
                  <span>Manage Bookings</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setActiveSection('technicians')}
                >
                  <Users className="h-6 w-6" />
                  <span>View Technicians</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setActiveSection('subscriptions')}
                >
                  <DollarSign className="h-6 w-6" />
                  <span>Subscriptions</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setActiveSection('user-management')}
                >
                  <User className="h-6 w-6" />
                  <span>User Management</span>
                </Button>
              </div>
            </Card>

            {/* Recent Bookings */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Recent Bookings</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection('bookings')}>View All</Button>
                </div>
                <div className="space-y-4">
                  {recentBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="space-y-1">
                        <p className="font-semibold">{booking.customer}</p>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                        <p className="text-xs text-muted-foreground">Tech: {booking.technician}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{booking.amount}</p>
                        <p className="text-xs text-muted-foreground">{booking.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Top Technicians</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection('technicians')}>View All</Button>
                </div>
                <div className="space-y-4">
                  {topTechnicians.slice(0, 3).map((tech, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold">
                          {tech.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold">{tech.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {tech.rating}
                            </span>
                            <span>{tech.jobs} jobs</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{tech.earnings}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">All Bookings</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Filter</Button>
                  <Button variant="accent" size="sm">Export</Button>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No bookings found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-4 border-2 border-border rounded-lg hover:border-accent/50 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-muted-foreground">
                              BR-{booking.id.slice(0, 8).toUpperCase()}
                            </span>
                            <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                              {booking.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            {!booking.technician_id && (
                              <Badge variant="destructive" className="text-xs">
                                Unassigned
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <p className="font-semibold">
                              {booking.services?.name || 'Service'}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {booking.service_address}, {booking.service_city}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {booking.technician_id ? 'Technician Assigned' : 'No Technician'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary mb-2">
                            ₱{booking.total_price}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {!booking.technician_id && (
                              <Button 
                                variant="accent" 
                                size="sm"
                                onClick={() => handleAssignTechnician(booking)}
                              >
                                <UserPlus className="h-4 w-4 mr-1" />
                                Assign
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        );

      case 'technicians':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Top Performing Technicians</h3>
                <Button variant="accent">Add New Technician</Button>
              </div>
              <div className="space-y-4">
                {topTechnicians.map((tech, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:shadow-medium transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold">
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold">{tech.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {tech.rating}
                          </span>
                          <span>{tech.jobs} jobs</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{tech.earnings}</p>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'messages':
        return (
          <div className="h-full flex flex-col">
            <div className="mb-6 flex-shrink-0">
              <h2 className="text-2xl font-bold mb-2">Admin Messages</h2>
              <p className="text-muted-foreground">
                Monitor and participate in client-technician conversations
              </p>
            </div>
            <div className="flex-1 min-h-0">
              <MessagingLayout className="h-full" />
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Analytics Dashboard</h3>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Analytics features coming soon</p>
              </div>
            </Card>
          </div>
        );

      case 'subscriptions':
        return (
          <div className="space-y-6">
            <SubscriptionManagement />
          </div>
        );

      case 'user-management':
        return (
          <div className="space-y-6">
            <UserManagement />
          </div>
        );

      case 'roles-permissions':
        return (
          <div className="space-y-6">
            <RolesPermissions />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Settings</h3>
              <div className="text-center py-12">
                <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Settings panel coming soon</p>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
      <div className={`${activeSection === 'messages' ? 'h-screen flex flex-col' : 'p-6'}`}>
        <div className={`${activeSection === 'messages' ? 'flex-1 min-h-0' : 'container mx-auto'}`}>
          {/* Main Content */}
          {renderActiveSection()}
        </div>
      </div>

      {/* Technician Assignment Modal */}
      <TechnicianAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        booking={selectedBooking}
        onAssignmentComplete={handleAssignmentComplete}
      />
    </DashboardLayout>
  );
};

export default Admin;