import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Wrench, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Home,
  Settings,
  Trash2,
  Search,
  Eye,
  FileText,
  HelpCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Service {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category: string;
  estimated_duration: number; // in minutes
  icon?: string;
}

interface ServiceArea {
  id: string;
  city: string;
  province: string;
  is_active: boolean;
}

interface BookingData {
  service: Service | null;
  address: string;
  city: string;
  coordinates: { lat: number; lng: number } | null;
  date: string;
  time: string;
  notes: string;
}

const StepBooking = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    address: "",
    city: "",
    coordinates: null,
    date: "",
    time: "",
    notes: "",
  });

  const steps = [
    { id: 1, title: "Service Type", icon: Wrench, description: "Choose your service" },
    { id: 2, title: "Pricing", icon: CheckCircle, description: "Review pricing details" },
    { id: 3, title: "Location", icon: MapPin, description: "Select service location" },
    { id: 4, title: "Schedule", icon: CalendarIcon, description: "Pick date & time" },
    { id: 5, title: "Details", icon: FileText, description: "Additional information" },
    { id: 6, title: "Confirm", icon: CheckCircle, description: "Review & book" },
  ];

  const serviceCategories = {
    installation: { 
      label: 'Installation', 
      icon: Home, 
      color: 'bg-blue-500',
      description: 'New air conditioning unit installation'
    },
    dismantle: { 
      label: 'Dismantle / Removal', 
      icon: Trash2, 
      color: 'bg-red-500',
      description: 'Remove or dismantle existing units'
    },
    repair: { 
      label: 'Repair & Troubleshooting', 
      icon: Settings, 
      color: 'bg-orange-500',
      description: 'Fix issues and troubleshoot problems'
    },
    cleaning: { 
      label: 'General Cleaning', 
      icon: Search, 
      color: 'bg-green-500',
      description: 'Maintenance and cleaning services'
    },
    inspection: { 
      label: 'Inspection / Quotation', 
      icon: Eye, 
      color: 'bg-purple-500',
      description: 'Professional assessment and quotes'
    }
  };

  useEffect(() => {
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
    fetchData();
  }, [user, authLoading]);

  useEffect(() => {
    if (currentStep === 2 && mapRef.current && !mapLoaded) {
      initializeMap();
    }
  }, [currentStep, mapLoaded]);

  const fetchData = async () => {
    try {
      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });
      
      if (servicesError) {
        console.error('Error fetching services:', servicesError);
        toast({
          title: "Error loading services",
          description: "Please refresh the page and try again",
          variant: "destructive",
        });
      } else {
        setServices(servicesData || []);
      }

      // Fetch service areas
      const { data: areasData, error: areasError } = await supabase
        .from('service_areas')
        .select('*')
        .eq('is_active', true)
        .order('city', { ascending: true });
      
      if (areasError) {
        console.error('Error fetching service areas:', areasError);
      } else {
        // Deduplicate service areas by city name
        const uniqueAreas = areasData ? areasData.reduce((acc: ServiceArea[], current) => {
          const existingArea = acc.find(area => area.city === current.city);
          if (!existingArea) {
            acc.push(current);
          }
          return acc;
        }, []) : [];
        
        setServiceAreas(uniqueAreas);
        if (uniqueAreas.length > 0 && !bookingData.city) {
          setBookingData(prev => ({ ...prev, city: uniqueAreas[0].city }));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Connection error",
        description: "Unable to load services. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const initializeMap = async () => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'YOUR_API_KEY') {
        // Fallback: Show a placeholder map
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="w-full h-full flex items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
              <div class="text-center p-6">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 class="font-semibold mb-2">Interactive Map</h3>
                <p class="text-sm text-muted-foreground mb-4">
                  To enable map functionality, please add your Google Maps API key to the environment variables.
                </p>
                <p class="text-xs text-muted-foreground">
                  Add VITE_GOOGLE_MAPS_API_KEY to your .env file
                </p>
              </div>
            </div>
          `;
        }
        setMapLoaded(true);
        return;
      }

      const { Loader } = await import('@googlemaps/js-api-loader');
      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['places']
      });

      const google = await loader.load();
      
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 14.5995, lng: 120.9842 }, // Manila coordinates
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        mapInstanceRef.current = map;

        // Add click listener to map
        map.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            
            setBookingData(prev => ({
              ...prev,
              coordinates: { lat, lng }
            }));

            // Update marker
            if (markerRef.current) {
              markerRef.current.setPosition(event.latLng);
            } else {
              markerRef.current = new google.maps.Marker({
                position: event.latLng,
                map: map,
                title: 'Service Location'
              });
            }

            // Reverse geocoding to get address
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: event.latLng }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                setBookingData(prev => ({
                  ...prev,
                  address: results[0].formatted_address
                }));
              }
            });
          }
        });

        setMapLoaded(true);
      }
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      // Show fallback map
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div class="w-full h-full flex items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
            <div class="text-center p-6">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 class="font-semibold mb-2">Map Unavailable</h3>
              <p class="text-sm text-muted-foreground">
                Unable to load the interactive map. Please enter your address manually.
              </p>
            </div>
          </div>
        `;
      }
      setMapLoaded(true);
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const formatDate = (date: string) => {
    if (!date) return "Pick a date";
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!bookingData.service) {
          toast({
            title: "Service required",
            description: "Please select a service type",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        return true; // Pricing step - no validation needed
      case 3:
        if (!bookingData.address || !bookingData.city) {
          toast({
            title: "Location required",
            description: "Please provide a complete address",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 4:
        if (!bookingData.date || !bookingData.time) {
          toast({
            title: "Schedule required",
            description: "Please select date and time",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 5:
        return true; // Notes are optional
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!user || !bookingData.service) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Fallback coordinates for Manila if not provided
    const fallbackCoordinates = {
      lat: 14.5995, // Manila coordinates
      lng: 120.9842
    };

    const coordinates = bookingData.coordinates || fallbackCoordinates;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        client_id: user.id,
        service_id: bookingData.service.id,
        service_address: bookingData.address,
        service_city: bookingData.city,
        service_latitude: coordinates.lat,
        service_longitude: coordinates.lng,
        scheduled_date: bookingData.date,
        scheduled_time: bookingData.time,
        notes: bookingData.notes,
        total_price: bookingData.service.base_price,
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">Choose Your Service</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-accent cursor-help transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-semibold">How to get started:</p>
                        <ul className="text-sm space-y-1">
                          <li>• Click on any service category below</li>
                          <li>• Browse available services in that category</li>
                          <li>• Select your preferred service option</li>
                          <li>• Review pricing details in the next step</li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-muted-foreground">Select the type of air conditioning service you need</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(serviceCategories).map(([key, category], index) => {
                const IconComponent = category.icon;
                const categoryServices = services.filter(s => s.category === key);
                
                if (categoryServices.length === 0) return null;
                
                return (
                  <AccordionItem key={key} value={key} className="border rounded-lg mb-4">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${category.color} text-white`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-lg">{category.label}</h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        {index === 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="ml-auto mr-2">
                                  <Badge variant="outline" className="text-xs">
                                    Click to expand
                                  </Badge>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p>Click here to see available services in this category</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="grid md:grid-cols-2 gap-3">
                        {categoryServices.map((service) => (
                          <Card 
                            key={service.id}
                            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                              bookingData.service?.id === service.id 
                                ? 'ring-2 ring-accent bg-accent/5' 
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => setBookingData(prev => ({ ...prev, service }))}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{service.name}</h4>
                              <Badge variant="secondary">₱{service.base_price}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {service.estimated_duration ? 
                                `${Math.floor(service.estimated_duration / 60)}h ${service.estimated_duration % 60}m` : 
                                '1-2 hours'
                              }
                            </div>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Service Pricing</h2>
              <p className="text-muted-foreground">Review the pricing details for your selected service</p>
            </div>
            
            {bookingData.service && (
              <Card className="p-8 shadow-large">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                      <Wrench className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{bookingData.service.name}</h3>
                    <p className="text-muted-foreground capitalize">{bookingData.service.category}</p>
                  </div>
                  
                  <div className="border-t pt-6">
                    <p className="text-sm text-muted-foreground mb-2">Service Description</p>
                    <p className="text-lg">{bookingData.service.description}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-accent" />
                          <div>
                            <p className="font-medium">Estimated Duration</p>
                            <p className="text-sm text-muted-foreground">Service completion time</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {bookingData.service.estimated_duration ? 
                              `${Math.floor(bookingData.service.estimated_duration / 60)}h ${bookingData.service.estimated_duration % 60}m` : 
                              '1-2 hours'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg border border-accent/20">
                        <div>
                          <p className="font-medium">Base Price</p>
                          <p className="text-sm text-muted-foreground">Professional service fee</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-2xl text-accent">₱{bookingData.service.base_price}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">What's Included</h4>
                        <ul className="space-y-1 text-sm text-green-700">
                          <li>• Professional installation/repair</li>
                          <li>• Quality materials and tools</li>
                          <li>• Clean-up after service</li>
                          <li>• 30-day service warranty</li>
                          <li>• Free consultation</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Service Guarantee</h4>
                        <p className="text-sm text-blue-700">
                          We guarantee quality workmanship and customer satisfaction. 
                          If you're not happy with our service, we'll make it right.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Ready to proceed?</p>
                      <p className="text-lg font-semibold">
                        Total Service Cost: <span className="text-accent text-2xl">₱{bookingData.service.base_price}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Service Location</h2>
              <p className="text-muted-foreground">Click on the map to select your service location</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Service Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your address or click on the map"
                    value={bookingData.address}
                    onChange={(e) => setBookingData(prev => ({ ...prev, address: e.target.value }))}
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={bookingData.city}
                    onValueChange={(value) => setBookingData(prev => ({ ...prev, city: value }))}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceAreas.map((area) => (
                        <SelectItem key={area.id} value={area.city}>
                          {area.city}, {area.province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {bookingData.coordinates ? "Selected coordinates:" : "Default coordinates (Manila):"}
                  </p>
                  <p className="font-mono text-xs">
                    {bookingData.coordinates 
                      ? `${bookingData.coordinates.lat.toFixed(6)}, ${bookingData.coordinates.lng.toFixed(6)}`
                      : "14.599500, 120.984200"
                    }
                  </p>
                  {!bookingData.coordinates && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Click on the map to set specific coordinates
                    </p>
                  )}
                </div>
              </div>
              
              <div className="h-96 rounded-lg overflow-hidden border">
                <div ref={mapRef} className="w-full h-full" />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Schedule Your Service</h2>
              <p className="text-muted-foreground">Choose your preferred date and time</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(bookingData.date)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={bookingData.date ? new Date(bookingData.date) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setBookingData(prev => ({ 
                            ...prev, 
                            date: date.toISOString().split('T')[0] 
                          }));
                          setCalendarOpen(false);
                        }
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Select
                  value={bookingData.time}
                  onValueChange={(value) => setBookingData(prev => ({ ...prev, time: value }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Quick Time Selection</h4>
              <p className="text-sm text-muted-foreground mb-3">Or click a time slot below for quick selection</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: '08:00', label: '8:00 AM' },
                  { value: '10:00', label: '10:00 AM' },
                  { value: '12:00', label: '12:00 PM' },
                  { value: '14:00', label: '2:00 PM' },
                  { value: '16:00', label: '4:00 PM' },
                  { value: '18:00', label: '6:00 PM' }
                ].map((timeSlot) => (
                  <Button
                    key={timeSlot.value}
                    variant={bookingData.time === timeSlot.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBookingData(prev => ({ ...prev, time: timeSlot.value }))}
                    className="text-xs"
                  >
                    {timeSlot.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Additional Details</h2>
              <p className="text-muted-foreground">Tell us more about your service requirements</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements, issues, or special instructions..."
                value={bookingData.notes}
                onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                className="min-h-32"
              />
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">What to expect:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Our technician will arrive within the scheduled time window</li>
                <li>• Professional assessment and transparent pricing</li>
                <li>• Quality workmanship with warranty coverage</li>
                <li>• Clean-up after service completion</li>
              </ul>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Confirm Your Booking</h2>
              <p className="text-muted-foreground">Review your booking details before confirming</p>
            </div>
            
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Service Details</h3>
                    <p className="text-muted-foreground">{bookingData.service?.name}</p>
                    <p className="text-sm text-muted-foreground">{bookingData.service?.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-lg">₱{bookingData.service?.base_price}</Badge>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Location</h3>
                  <p className="text-muted-foreground">{bookingData.address}</p>
                  <p className="text-sm text-muted-foreground">{bookingData.city}</p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Schedule</h3>
                  <p className="text-muted-foreground">
                    {new Date(bookingData.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">at {bookingData.time}</p>
                </div>
                
                {bookingData.notes && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-muted-foreground">{bookingData.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Book Your Service</h1>
                <div className="text-sm text-muted-foreground">
                  Step {currentStep} of {steps.length}
                </div>
              </div>
              
              <div className="space-y-4">
                <Progress value={(currentStep / steps.length) * 100} className="h-2" />
                
                <div className="flex justify-between">
                  {steps.map((step) => {
                    const IconComponent = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center space-y-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted 
                            ? 'bg-accent text-accent-foreground' 
                            : isActive 
                              ? 'bg-accent text-accent-foreground' 
                              : 'bg-muted text-muted-foreground'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <IconComponent className="h-5 w-5" />
                          )}
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step Content */}
            <Card className="p-8 shadow-large mb-8">
              {renderStepContent()}
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? 'Submitting...' : 'Confirm Booking'}
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepBooking;
