import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Wrench } from 'lucide-react';

interface Technician {
  id: string;
  skills: string[];
  service_area: string[];
  availability_status: string;
  rating: number;
  total_jobs: number;
  completed_jobs: number;
  is_verified: boolean;
  profiles: {
    full_name: string;
    phone: string;
    avatar_url?: string;
  };
}

const TechnicianFinder = ({ selectedCity }: { selectedCity: string }) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCity) {
      fetchTechnicians();
    }
  }, [selectedCity]);

  const fetchTechnicians = async () => {
    try {
      const { data, error } = await supabase
        .from('technicians')
        .select(`
          *,
          profiles!inner (
            full_name,
            phone,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .eq('is_verified', true)
        .contains('service_area', [selectedCity]);

      if (error) {
        console.error('Error fetching technicians:', error);
      } else {
        setTechnicians(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (technicians.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No verified technicians available in {selectedCity}</p>
          <p className="text-sm mt-2">We'll assign the best available technician for your area.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Wrench className="h-5 w-5 text-accent" />
        Available Technicians in {selectedCity}
      </h3>
      <div className="space-y-4">
        {technicians.map((tech) => (
          <div key={tech.id} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{tech.profiles.full_name}</h4>
                  {tech.is_verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{tech.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{tech.completed_jobs} jobs completed</span>
                  </div>
                </div>

                {tech.skills && tech.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {tech.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {tech.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{tech.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Available in {tech.service_area?.join(', ')}</span>
                </div>
              </div>
              
              <div className="text-right">
                <Badge 
                  variant={tech.availability_status === 'available' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {tech.availability_status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TechnicianFinder;

