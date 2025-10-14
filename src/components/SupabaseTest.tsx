import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [services, setServices] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .limit(5);

      if (error) {
        setError(`Database Error: ${error.message}`);
        setConnectionStatus('❌ Connection Failed');
      } else {
        setConnectionStatus('✅ Connected Successfully');
        setServices(data || []);
      }
    } catch (err: any) {
      setError(`Connection Error: ${err.message}`);
      setConnectionStatus('❌ Connection Failed');
    }
  };

  const testAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
    } catch (err) {
      console.error('Auth test error:', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Supabase Connection Test</h2>
        
        <div className="mb-4">
          <p><strong>Status:</strong> {connectionStatus}</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="mb-4">
          <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</p>
          <p><strong>API Key:</strong> {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'Set' : 'Not set'}</p>
        </div>

        <div className="mb-4">
          <Button onClick={testConnection} className="mr-2">
            Test Connection
          </Button>
          <Button onClick={testAuth} variant="outline">
            Test Auth
          </Button>
        </div>

        {services.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Services Found ({services.length}):</h3>
            <div className="grid gap-2">
              {services.map((service) => (
                <div key={service.id} className="p-2 border rounded">
                  <p><strong>{service.name}</strong></p>
                  <p>Category: {service.category}</p>
                  <p>Price: ₱{service.base_price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SupabaseTest;

