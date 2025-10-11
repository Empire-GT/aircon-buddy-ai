import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Calendar, MapPin, Clock, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      navigate('/booking');
      return;
    }
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        services (name, category, base_price),
        profiles!bookings_client_id_fkey (full_name, phone)
      `)
      .eq('id', bookingId)
      .single();

    if (data) {
      setBooking(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <p className="text-muted-foreground">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground">Booking not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-4">
                <CheckCircle2 className="w-12 h-12 text-accent" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-xl text-muted-foreground">
                Your service request has been submitted successfully
              </p>
            </div>

            {/* Booking Details Card */}
            <Card className="p-8 shadow-large mb-6">
              <div className="space-y-6">
                <div className="pb-4 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                  <p className="font-mono font-semibold">{booking.id.slice(0, 8).toUpperCase()}</p>
                </div>

                <div className="pb-4 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-1">Service</p>
                  <p className="text-xl font-semibold">{booking.services.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{booking.services.category}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pb-4 border-b border-border">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Date</p>
                      <p className="font-semibold">
                        {new Date(booking.scheduled_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Time</p>
                      <p className="font-semibold">{booking.scheduled_time}</p>
                    </div>
                  </div>
                </div>

                <div className="pb-4 border-b border-border">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Service Address</p>
                      <p className="font-semibold">{booking.service_address}</p>
                      <p className="text-sm text-muted-foreground">{booking.service_city}</p>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="pb-4 border-b border-border">
                    <p className="text-sm text-muted-foreground mb-1">Additional Notes</p>
                    <p className="font-semibold">{booking.notes}</p>
                  </div>
                )}

                <div className="bg-accent/5 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Total Amount</p>
                    <p className="text-3xl font-bold text-accent">₱{booking.total_price}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Status: <span className="capitalize font-semibold">{booking.status}</span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Next Steps Card */}
            <Card className="p-6 bg-accent/5 border-accent/20 mb-6">
              <h3 className="font-bold text-lg mb-4">What happens next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Technician Assignment</p>
                    <p className="text-sm text-muted-foreground">
                      We'll assign a qualified technician to your booking
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Confirmation Call</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a confirmation call within 24 hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Service Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Our technician will arrive at your scheduled time
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Card */}
            <Card className="p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">Need to make changes?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you need to reschedule or cancel your booking, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent" />
                  <a href="tel:+1234567890" className="font-semibold hover:text-accent transition-colors">
                    +63 123 456 7890
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent" />
                  <a href="mailto:support@coolairpro.com" className="font-semibold hover:text-accent transition-colors">
                    support@coolairpro.com
                  </a>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="accent"
                size="lg"
                className="flex-1"
                onClick={() => navigate('/dashboard/client')}
              >
                View My Bookings
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
