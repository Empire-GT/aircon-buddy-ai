import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Calendar, MapPin, Clock, Phone, Mail, Download, Share2, Printer, CalendarPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      navigate('/booking');
      return;
    }
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name, category, base_price)
        `)
        .eq('id', bookingId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching booking:', error);
        setError(error.message);
      } else if (data) {
        setBooking(data);
      } else {
        setError('Booking not found');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    const receiptData = `
BOOKING RECEIPT
=====================================
Booking ID: ${booking.id.slice(0, 8).toUpperCase()}
Service: ${booking.services.name}
Date: ${new Date(booking.scheduled_date).toLocaleDateString()}
Time: ${booking.scheduled_time}
Address: ${booking.service_address}, ${booking.service_city}
Total: ₱${booking.total_price}
Status: ${booking.status}
=====================================
    `.trim();

    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${booking.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Receipt downloaded",
      description: "Your booking receipt has been saved",
    });
  };

  const handleShare = async () => {
    const shareText = `My CoolAir Pro Booking
Service: ${booking.services.name}
Date: ${new Date(booking.scheduled_date).toLocaleDateString()} at ${booking.scheduled_time}
Address: ${booking.service_address}, ${booking.service_city}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CoolAir Pro Booking',
          text: shareText,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard",
        description: "Booking details copied to clipboard",
      });
    }
  };

  const handleAddToCalendar = () => {
    const startDate = new Date(`${booking.scheduled_date}T${booking.scheduled_time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('CoolAir Pro Service - ' + booking.services.name)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent('Service: ' + booking.services.name + '\nAddress: ' + booking.service_address + ', ' + booking.service_city)}&location=${encodeURIComponent(booking.service_address + ', ' + booking.service_city)}`;
    
    window.open(calendarUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your booking confirmation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-destructive/10 rounded-full mb-4">
                <Clock className="w-12 h-12 text-destructive" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Unable to Load Booking</h1>
              <p className="text-muted-foreground mb-8">
                {error || "We couldn't find this booking. It may have been removed or you don't have permission to view it."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard/client')} variant="accent">
                  Go to My Bookings
                </Button>
                <Button onClick={() => navigate('/booking')} variant="outline">
                  Make New Booking
                </Button>
              </div>
            </div>
          </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleDownloadReceipt}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleAddToCalendar}
                className="flex items-center gap-2"
              >
                <CalendarPlus className="w-4 h-4" />
                Calendar
              </Button>
            </div>

            {/* Navigation Buttons */}
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
