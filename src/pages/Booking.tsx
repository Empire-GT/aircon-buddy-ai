import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Booking = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "Metro Manila",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) return;
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book a service",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    fetchServices();
  }, [user, authLoading]);

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true });
    
    if (data) setServices(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedService) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        client_id: user.id,
        service_id: selectedService.id,
        service_address: formData.address,
        service_city: formData.city,
        scheduled_date: formData.date,
        scheduled_time: formData.time,
        notes: formData.notes,
        total_price: selectedService.base_price,
        status: 'pending'
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate(`/booking/confirmation?bookingId=${data.id}`);
    }
  };

  const serviceCategories = {
    installation: 'Installation',
    dismantle: 'Dismantle / Removal',
    repair: 'Repair & Troubleshooting',
    cleaning: 'General Cleaning',
    inspection: 'Inspection / Quotation'
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">Book Your Service</h1>
              <p className="text-xl text-muted-foreground">
                Fill in the details below and we'll connect you with a verified technician
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 p-8 shadow-large">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-base font-semibold flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-accent" />
                      Service Type
                    </Label>
                    <Select
                      value={selectedService?.id}
                      onValueChange={(value) => {
                        const service = services.find(s => s.id === value);
                        setSelectedService(service);
                      }}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(serviceCategories).map(([key, label]) => (
                          <div key={key}>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                              {label}
                            </div>
                            {services
                              .filter(s => s.category === key)
                              .map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name} - ₱{service.base_price}
                                </SelectItem>
                              ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-base font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      Service Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-base font-semibold">
                      City
                    </Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => setFormData({ ...formData, city: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Metro Manila">Metro Manila</SelectItem>
                        <SelectItem value="Cavite">Cavite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-base font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-accent" />
                        Preferred Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        className="h-12"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-base font-semibold">
                        Preferred Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-base font-semibold">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any specific requirements or issues you'd like to mention..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="min-h-24"
                    />
                  </div>

                  <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Booking Request'}
                  </Button>
                </form>
              </Card>

              <div className="space-y-6">
                <Card className="p-6 shadow-medium sticky top-24">
                  <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-border">
                      <p className="text-sm text-muted-foreground mb-1">Service Type</p>
                      <p className="font-semibold">
                        {selectedService?.name || "Not selected"}
                      </p>
                    </div>
                    {selectedService && (
                      <div className="pb-4 border-b border-border">
                        <p className="text-sm text-muted-foreground mb-1">Service Price</p>
                        <p className="text-2xl font-bold text-accent">₱{selectedService.base_price}</p>
                      </div>
                    )}
                    <div className="pb-4 border-b border-border">
                      <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                      <p className="font-semibold">
                        {formData.date || "Not selected"}
                        {formData.time && ` at ${formData.time}`}
                      </p>
                    </div>
                    <div className="pb-4 border-b border-border">
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-semibold">
                        {formData.address || "Not provided"}
                        {formData.city && `, ${formData.city}`}
                      </p>
                    </div>
                    <div className="pt-2">
                      <div className="bg-accent/10 rounded-lg p-4">
                        <p className="text-sm text-accent font-semibold mb-1">Next Steps:</p>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Technician assignment</li>
                          <li>• Price confirmation</li>
                          <li>• Real-time tracking</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
