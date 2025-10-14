import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, MapPin, User, Phone } from 'lucide-react';

interface Booking {
  id: string;
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  service_address: string;
  service_city: string;
  notes?: string;
  total_price: number;
  created_at: string;
  services: {
    name: string;
    category: string;
  };
  profiles?: {
    full_name: string;
    phone: string;
  };
}

const BookingStatus = ({ bookingId }: { bookingId: string }) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('booking-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${bookingId}`,
        },
        (payload) => {
          setBooking(payload.new as Booking);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name, category),
          technicians (
            id,
            profiles!id (full_name, phone)
          )
        `)
        .eq('id', bookingId)
        .single();

      if (error) {
        console.error('Error fetching booking:', error);
      } else {
        setBooking(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'confirmed': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'assigned': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!booking) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>Booking not found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Booking Status</h3>
        <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
          {getStatusIcon(booking.status)}
          {booking.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Service</p>
            <p className="font-semibold">{booking.services.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Price</p>
            <p className="font-semibold">₱{booking.total_price}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-semibold">{new Date(booking.scheduled_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Time</p>
            <p className="font-semibold">{booking.scheduled_time}</p>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground flex items-center gap-1 mb-1">
            <MapPin className="h-4 w-4" />
            Location
          </p>
          <p className="font-semibold">{booking.service_address}, {booking.service_city}</p>
        </div>

        {booking.technicians?.profiles && (
          <div className="text-sm">
            <p className="text-muted-foreground flex items-center gap-1 mb-1">
              <User className="h-4 w-4" />
              Assigned Technician
            </p>
            <div className="flex items-center justify-between">
              <p className="font-semibold">{booking.technicians.profiles.full_name}</p>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Call
              </Button>
            </div>
          </div>
        )}

        {booking.notes && (
          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Notes</p>
            <p className="font-semibold">{booking.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BookingStatus;

