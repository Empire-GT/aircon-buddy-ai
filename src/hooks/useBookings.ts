import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  technician_id?: string;
  services: {
    name: string;
    category: string;
  };
  client_profiles?: {
    full_name: string;
    phone: string;
    email: string;
  };
  technicians?: {
    id: string;
    technician_profiles?: {
      full_name: string;
      phone: string;
    };
  };
}

// Fetch all bookings
export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services (name, category)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch bookings: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Approve booking mutation
export const useApproveBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) {
        throw new Error(`Failed to approve booking: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Success",
        description: "Booking approved successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

// Reject booking mutation
export const useRejectBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) {
        throw new Error(`Failed to reject booking: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Success",
        description: "Booking rejected successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

// Assign technician mutation
export const useAssignTechnician = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bookingId, technicianId }: { bookingId: string; technicianId: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          technician_id: technicianId,
          status: 'assigned'
        })
        .eq('id', bookingId);

      if (error) {
        throw new Error(`Failed to assign technician: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Success",
        description: "Technician assigned successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

// Reschedule booking mutation
export const useRescheduleBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      bookingId, 
      newDate, 
      newTime 
    }: { 
      bookingId: string; 
      newDate: string; 
      newTime: string; 
    }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          scheduled_date: newDate,
          scheduled_time: newTime
        })
        .eq('id', bookingId);

      if (error) {
        throw new Error(`Failed to reschedule booking: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Success",
        description: "Booking rescheduled successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

