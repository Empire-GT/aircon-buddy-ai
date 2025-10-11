import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services (name, category),
        technicians (
          profiles (full_name, phone)
        )
      `)
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  };

  const canCancelBooking = (scheduledDate: string) => {
    const bookingDate = new Date(scheduledDate);
    const today = new Date();
    const diffTime = bookingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 3;
  };

  const handleCancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (!error) {
      fetchBookings();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground text-lg">
              View and manage your aircon service bookings
            </p>
          </div>

          <div className="grid gap-6">
            {loading ? (
              <p className="text-center text-muted-foreground py-12">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No bookings yet</p>
                <Button variant="accent" onClick={() => navigate('/booking')}>
                  Book a Service
                </Button>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id} className="p-6 hover:shadow-large transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{booking.services?.name}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.service_address}, {booking.service_city}</span>
                        </div>
                        {booking.technicians && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Technician: {booking.technicians.profiles?.full_name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent mb-4">₱{booking.total_price}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {booking.status === 'pending' && canCancelBooking(booking.scheduled_date) && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
