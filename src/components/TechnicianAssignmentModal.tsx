import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, MapPin, Clock, User, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Technician {
  id: string;
  skills: string[];
  service_area: string[];
  availability_status: string;
  rating: number;
  total_jobs: number;
  completed_jobs: number;
  is_verified: boolean;
  is_active: boolean;
}

interface Booking {
  id: string;
  client_id: string;
  technician_id: string | null;
  service_id: string;
  status: string;
  service_address: string;
  service_city: string;
  scheduled_date: string;
  scheduled_time: string;
  total_price: number;
  services?: {
    name: string;
    category: string;
  };
}

interface TechnicianAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onAssignmentComplete: () => void;
}

const TechnicianAssignmentModal = ({
  isOpen,
  onClose,
  booking,
  onAssignmentComplete
}: TechnicianAssignmentModalProps) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && booking) {
      fetchAvailableTechnicians();
    }
  }, [isOpen, booking]);

  const fetchAvailableTechnicians = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .eq('is_active', true)
        .eq('availability_status', 'available');

      if (error) {
        console.error('Error fetching technicians:', error);
        toast({
          title: "Error",
          description: "Failed to fetch available technicians",
          variant: "destructive",
        });
        return;
      }

      setTechnicians(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTechnician = async () => {
    if (!selectedTechnician || !booking) return;

    setAssigning(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          technician_id: selectedTechnician,
          status: 'assigned'
        })
        .eq('id', booking.id);

      if (error) {
        console.error('Error assigning technician:', error);
        toast({
          title: "Error",
          description: "Failed to assign technician",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Technician assigned successfully",
      });

      onAssignmentComplete();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
    }
  };

  const getTechnicianRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Assign Technician</DialogTitle>
          <DialogDescription>
            Select a technician for this booking
          </DialogDescription>
        </DialogHeader>

        {/* Booking Details */}
        <Card className="p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg">
                {booking.services?.name || 'Service'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Booking ID: {booking.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <Badge variant="outline">
              ₱{booking.total_price}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{booking.service_address}, {booking.service_city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}
              </span>
            </div>
          </div>
        </Card>

        {/* Available Technicians */}
        <div className="space-y-4">
          <h4 className="font-semibold">Available Technicians</h4>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading technicians...</p>
            </div>
          ) : technicians.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No available technicians found</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {technicians.map((technician) => (
                  <Card
                    key={technician.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedTechnician === technician.id
                        ? 'ring-2 ring-accent bg-accent/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedTechnician(technician.id)}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>
                          {technician.id.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-semibold">Technician {technician.id.slice(0, 8)}</h5>
                          {technician.is_verified && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 mb-2">
                          {getTechnicianRating(technician.rating)}
                          <span className="text-sm text-muted-foreground ml-1">
                            ({technician.rating.toFixed(1)})
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p>Jobs Completed: {technician.completed_jobs}</p>
                            <p>Total Jobs: {technician.total_jobs}</p>
                          </div>
                          <div>
                            <p>Skills: {technician.skills.slice(0, 2).join(', ')}</p>
                            <p>Areas: {technician.service_area.slice(0, 2).join(', ')}</p>
                          </div>
                        </div>
                      </div>
                      
                      {selectedTechnician === technician.id && (
                        <div className="flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-accent" />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssignTechnician}
            disabled={!selectedTechnician || assigning}
            variant="accent"
          >
            {assigning ? 'Assigning...' : 'Assign Technician'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicianAssignmentModal;
