import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Star, CheckCircle, Clock, User, Bell, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type DashboardSection = 'dashboard' | 'jobs' | 'profile' | 'earnings' | 'notifications' | 'faq';

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [techData, setTechData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');

  useEffect(() => {
    if (user) {
      fetchTechnicianData();
      fetchBookings();
    }
  }, [user]);

  const fetchTechnicianData = async () => {
    const { data } = await supabase
      .from('technicians')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (data) setTechData(data);
  };

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        services (name, category),
        profiles!client_id (full_name, phone, address)
      `)
      .eq('technician_id', user?.id)
      .in('status', ['confirmed', 'assigned', 'in_progress'])
      .order('scheduled_date', { ascending: true });

    if (data) setBookings(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: 'confirmed' | 'in_progress' | 'completed') => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (!error) {
      fetchBookings();
      if (newStatus === 'completed') {
        fetchTechnicianData();
      }
    }
  };

  const stats = [
    { label: 'Total Jobs', value: techData?.total_jobs || 0, icon: Calendar },
    { label: 'Completed', value: techData?.completed_jobs || 0, icon: CheckCircle },
    { label: 'Rating', value: techData?.rating?.toFixed(1) || '0.0', icon: Star },
    { label: 'Earnings', value: `₱${techData?.earnings?.toFixed(2) || '0.00'}`, icon: DollarSign },
  ];

  // Dashboard Section Component
  const DashboardSection = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Technician Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Manage your jobs and track your performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Active Jobs */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Active Jobs</h2>
        <div className="grid gap-4">
          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading jobs...</p>
          ) : bookings.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No active jobs</p>
            </Card>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold">{booking.services?.name}</h3>
                      <Badge variant="secondary">{booking.status.replace('_', ' ')}</Badge>
                    </div>
                    
                    <div className="space-y-2 text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.service_address}, {booking.service_city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold">₱{booking.total_price}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <p className="text-sm">
                        <strong>Client:</strong> {booking.profiles?.full_name} • {booking.profiles?.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {booking.status === 'confirmed' && (
                      <Button 
                        variant="accent"
                        onClick={() => handleUpdateStatus(booking.id, 'in_progress')}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Start Job
                      </Button>
                    )}
                    {booking.status === 'in_progress' && (
                      <Button 
                        variant="default"
                        onClick={() => handleUpdateStatus(booking.id, 'completed')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // Jobs Section Component
  const JobsSection = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Jobs</h1>
        <p className="text-muted-foreground text-lg">
          View and manage all your assigned jobs
        </p>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading jobs...</p>
        ) : bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No jobs assigned</p>
          </Card>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold">{booking.services?.name}</h3>
                    <Badge variant="secondary">{booking.status.replace('_', ' ')}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.service_address}, {booking.service_city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">₱{booking.total_price}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <p className="text-sm">
                      <strong>Client:</strong> {booking.profiles?.full_name} • {booking.profiles?.phone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {booking.status === 'confirmed' && (
                    <Button 
                      variant="accent"
                      onClick={() => handleUpdateStatus(booking.id, 'in_progress')}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Start Job
                    </Button>
                  )}
                  {booking.status === 'in_progress' && (
                    <Button 
                      variant="default"
                      onClick={() => handleUpdateStatus(booking.id, 'completed')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  // Profile Section Component
  const ProfileSection = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground text-lg">
          Manage your technician profile and information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-lg">{techData?.full_name || user?.user_metadata?.full_name || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="text-lg">{techData?.phone || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Specialization</label>
              <p className="text-lg">{techData?.specialization || 'Not set'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Professional Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Jobs</span>
              <span className="font-bold">{techData?.total_jobs || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Completed Jobs</span>
              <span className="font-bold">{techData?.completed_jobs || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Rating</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{techData?.rating?.toFixed(1) || '0.0'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Earnings</span>
              <span className="font-bold">₱{techData?.earnings?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  // Earnings Section Component
  const EarningsSection = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Earnings</h1>
        <p className="text-muted-foreground text-lg">
          Track your earnings and financial performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Earnings</p>
          </div>
          <p className="text-3xl font-bold">₱{techData?.earnings?.toFixed(2) || '0.00'}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground">This Month</p>
          </div>
          <p className="text-3xl font-bold">₱{((techData?.earnings || 0) * 0.3).toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm text-muted-foreground">Completed Jobs</p>
          </div>
          <p className="text-3xl font-bold">{techData?.completed_jobs || 0}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Recent Earnings</h3>
        <div className="space-y-4">
          {bookings.filter(b => b.status === 'completed').slice(0, 5).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="font-medium">{booking.services?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(booking.scheduled_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">₱{booking.total_price}</p>
                <p className="text-sm text-green-600">Completed</p>
              </div>
            </div>
          ))}
          {bookings.filter(b => b.status === 'completed').length === 0 && (
            <p className="text-center text-muted-foreground py-8">No completed jobs yet</p>
          )}
        </div>
      </Card>
    </div>
  );

  // Notifications Section Component
  const NotificationsSection = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground text-lg">
          Stay updated with your job notifications
        </p>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Bell className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-1">New Job Assignment</h3>
                <p className="text-muted-foreground mb-2">
                  You have been assigned to {booking.services?.name} for {booking.profiles?.full_name}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{new Date(booking.scheduled_date).toLocaleDateString()}</span>
                  <span>{booking.scheduled_time}</span>
                  <Badge variant="secondary">{booking.status}</Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {bookings.length === 0 && (
          <Card className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </Card>
        )}
      </div>
    </div>
  );

  // FAQ Section Component
  const FAQSection = () => {
    const faqs = [
      {
        question: "How do I update my job status?",
        answer: "You can update your job status directly from the job cards in your dashboard. Click 'Start Job' when you arrive at the location, and 'Complete' when you finish the service."
      },
      {
        question: "How are my earnings calculated?",
        answer: "Your earnings are calculated based on the services you complete. Each completed job adds to your total earnings, and you can track your performance in the Earnings tab."
      },
      {
        question: "What should I do if I can't complete a job?",
        answer: "If you encounter issues that prevent job completion, contact our support team immediately. We'll help resolve the situation and may need to reschedule or reassign the job."
      },
      {
        question: "How do I update my profile information?",
        answer: "You can view your current profile information in the Profile tab. For updates, contact our admin team who can help modify your details and specialization."
      },
      {
        question: "What tools and equipment should I bring?",
        answer: "Bring your standard HVAC tools and equipment. For specific job requirements, check the job details in your dashboard or contact the client directly for any special requirements."
      },
      {
        question: "How do I get paid?",
        answer: "Payments are processed after job completion and client confirmation. You can track your earnings in the Earnings tab and expect payment within 3-5 business days."
      }
    ];

    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about working as a technician
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Function to render the active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'jobs':
        return <JobsSection />;
      case 'profile':
        return <ProfileSection />;
      case 'earnings':
        return <EarningsSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'faq':
        return <FAQSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <DashboardLayout 
      activeSection={activeSection} 
      onSectionChange={(section: string) => setActiveSection(section as DashboardSection)}
    >
      {renderActiveSection()}
    </DashboardLayout>
  );
};

export default TechnicianDashboard;