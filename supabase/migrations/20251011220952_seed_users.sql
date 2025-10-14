-- Seed data for services and service areas
-- This migration creates sample services and service areas for testing and development
-- Note: User profiles and roles are created automatically when users sign up via the trigger

-- Create service areas first
INSERT INTO public.service_areas (id, name, city, province, is_active, created_at) 
VALUES 
  (gen_random_uuid(), 'Quezon City', 'Quezon City', 'Metro Manila', true, now()),
  (gen_random_uuid(), 'Manila', 'Manila', 'Metro Manila', true, now()),
  (gen_random_uuid(), 'Caloocan', 'Caloocan', 'Metro Manila', true, now()),
  (gen_random_uuid(), 'Makati', 'Makati', 'Metro Manila', true, now()),
  (gen_random_uuid(), 'BGC', 'Taguig', 'Metro Manila', true, now()),
  (gen_random_uuid(), 'Ortigas', 'Pasig', 'Metro Manila', true, now()),
  (gen_random_uuid(), 'Mandaluyong', 'Mandaluyong', 'Metro Manila', true, now()),
  (gen_random_uuid(), 'Taguig', 'Taguig', 'Metro Manila', true, now()),
  (gen_random_uuid(), 'Pasig', 'Pasig', 'Metro Manila', true, now()),
  (gen_random_uuid(), 'Marikina', 'Marikina', 'Metro Manila', true, now()),
  (gen_random_uuid(), 'San Juan', 'San Juan', 'Metro Manila', true, now())
ON CONFLICT DO NOTHING;

-- Create sample services if they don't exist
INSERT INTO public.services (id, category, name, description, base_price, estimated_duration, is_active, created_at)
VALUES 
  (gen_random_uuid(), 'cleaning', 'General Cleaning - Window/Split', 'Complete cleaning service for window and split type air conditioners', 800.00, 120, true, now()),
  (gen_random_uuid(), 'cleaning', 'General Cleaning - Cassette', 'Complete cleaning service for cassette type air conditioners', 1000.00, 150, true, now()),
  (gen_random_uuid(), 'installation', 'Window Type Installation', 'Installation of window type air conditioner', 1500.00, 180, true, now()),
  (gen_random_uuid(), 'installation', 'Split Type Installation', 'Installation of split type air conditioner', 2000.00, 240, true, now()),
  (gen_random_uuid(), 'installation', 'Cassette Type Installation', 'Installation of cassette type air conditioner', 2500.00, 300, true, now()),
  (gen_random_uuid(), 'repair', 'Basic Repair', 'Basic repair and troubleshooting service', 600.00, 90, true, now()),
  (gen_random_uuid(), 'repair', 'Advanced Repair', 'Advanced repair and component replacement', 1200.00, 180, true, now()),
  (gen_random_uuid(), 'dismantle', 'Dismantle Service', 'Safe dismantling and removal of air conditioner', 500.00, 60, true, now()),
  (gen_random_uuid(), 'inspection', 'System Inspection', 'Comprehensive system inspection and assessment', 400.00, 60, true, now())
ON CONFLICT DO NOTHING;

-- Display summary of seeded data
DO $$
BEGIN
  RAISE NOTICE 'Seeded data summary:';
  RAISE NOTICE '- 11 Service areas created (Metro Manila cities)';
  RAISE NOTICE '- 9 Services created (cleaning, installation, repair, dismantle, inspection)';
  RAISE NOTICE '';
  RAISE NOTICE 'Note: User profiles and roles are created automatically when users sign up.';
  RAISE NOTICE 'To create test users, use the Supabase Auth API or sign up through the application.';
  RAISE NOTICE '';
  RAISE NOTICE 'Recommended test accounts to create:';
  RAISE NOTICE '- admin@coolairpro.com (Admin role)';
  RAISE NOTICE '- juan@coolairpro.com (Technician role)';
  RAISE NOTICE '- maria@coolairpro.com (Technician role)';
  RAISE NOTICE '- pedro@coolairpro.com (Technician role)';
  RAISE NOTICE '- client@test.com (Client role - default)';
END $$;
