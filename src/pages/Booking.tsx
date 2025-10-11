import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Phone, User, Wrench } from "lucide-react";
import { toast } from "sonner";

const Booking = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    serviceType: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Booking request submitted successfully! We'll contact you shortly.");
    setTimeout(() => navigate("/"), 2000);
  };

  const serviceTypes = [
    "General Cleaning",
    "Deep Cleaning",
    "Repair & Maintenance",
    "Installation",
    "Emergency Service",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">Book Your Service</h1>
              <p className="text-xl text-muted-foreground">
                Fill in the details below and we'll connect you with a verified technician
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <Card className="lg:col-span-2 p-8 shadow-large">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-semibold flex items-center gap-2">
                        <User className="h-4 w-4 text-accent" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4 text-accent" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+63 912 345 6789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-base font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      Service Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street, City, Province"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceType" className="text-base font-semibold flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-accent" />
                      Service Type
                    </Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-base font-semibold">
                        Preferred Time
                      </Label>
                      <Select
                        value={formData.time}
                        onValueChange={(value) => setFormData({ ...formData, time: value })}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                          <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                        </SelectContent>
                      </Select>
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

                  <Button type="submit" variant="accent" size="lg" className="w-full">
                    Submit Booking Request
                  </Button>
                </form>
              </Card>

              {/* Booking Summary */}
              <div className="space-y-6">
                <Card className="p-6 shadow-medium sticky top-24">
                  <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-border">
                      <p className="text-sm text-muted-foreground mb-1">Service Type</p>
                      <p className="font-semibold">
                        {formData.serviceType || "Not selected"}
                      </p>
                    </div>
                    <div className="pb-4 border-b border-border">
                      <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                      <p className="font-semibold">
                        {formData.date || "Not selected"}
                        {formData.time && ` - ${formData.time}`}
                      </p>
                    </div>
                    <div className="pb-4 border-b border-border">
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-semibold">
                        {formData.address || "Not provided"}
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
