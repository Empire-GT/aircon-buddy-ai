import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Technician {
  id: string;
  rating: number;
  total_jobs: number;
  completed_jobs: number;
  earnings: number;
  is_active: boolean;
  profiles: {
    full_name: string;
    phone: string;
    email: string;
  };
}

// Fetch all technicians
export const useTechnicians = () => {
  return useQuery({
    queryKey: ['technicians'],
    queryFn: async (): Promise<Technician[]> => {
      const { data, error } = await supabase
        .from('technicians')
        .select(`
          *,
          profiles!id (full_name, phone, email)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch technicians: ${error.message}`);
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes (technicians don't change often)
    refetchOnWindowFocus: false,
  });
};

// Create technician mutation (using localStorage for now)
export const useCreateTechnician = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (technicianData: {
      full_name: string;
      email: string;
      phone: string;
      skills: string;
      service_area: string;
    }) => {
      // Store pending technician info in localStorage
      const pendingTechnician = {
        id: crypto.randomUUID(),
        full_name: technicianData.full_name,
        email: technicianData.email,
        phone: technicianData.phone,
        skills: technicianData.skills.split(',').map(s => s.trim()),
        service_area: technicianData.service_area.split(',').map(s => s.trim()),
        created_at: new Date().toISOString(),
        status: 'pending'
      };

      // Get existing pending technicians
      const existingPending = JSON.parse(localStorage.getItem('pendingTechnicians') || '[]');
      existingPending.push(pendingTechnician);
      localStorage.setItem('pendingTechnicians', JSON.stringify(existingPending));

      return pendingTechnician;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pendingTechnicians'] });
      toast({
        title: "Success",
        description: `Technician invitation created for ${data.full_name}. They will need to sign up with ${data.email} to become an active technician.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to create technician invitation",
        variant: "destructive"
      });
    }
  });
};

// Fetch pending technicians from localStorage
export const usePendingTechnicians = () => {
  return useQuery({
    queryKey: ['pendingTechnicians'],
    queryFn: async () => {
      try {
        const pending = JSON.parse(localStorage.getItem('pendingTechnicians') || '[]');
        return pending;
      } catch (error) {
        console.error('Error loading pending technicians:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

