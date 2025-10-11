import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Star, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [techData, setTechData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
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
      </div>
    </div>
  );
};

export default TechnicianDashboard;
