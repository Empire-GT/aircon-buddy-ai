-- SQL script to create test users
-- Run this in the Supabase SQL Editor
-- Note: This requires the Supabase service role key or admin privileges

-- First, let's check if users already exist
SELECT email, id FROM auth.users WHERE email IN (
  'admin@coolairpro.com',
  'juan@coolairpro.com', 
  'maria@coolairpro.com',
  'pedro@coolairpro.com',
  'client@test.com'
);

-- If the above query returns no results, you need to create users through the Supabase Dashboard
-- or use the JavaScript script with proper credentials

-- After users are created, run these queries to assign roles and add technician details:

-- Assign admin role
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@coolairpro.com');

-- Assign technician roles
UPDATE public.user_roles 
SET role = 'technician' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'juan@coolairpro.com');

UPDATE public.user_roles 
SET role = 'technician' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'maria@coolairpro.com');

UPDATE public.user_roles 
SET role = 'technician' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'pedro@coolairpro.com');

-- Add technician details for Juan
INSERT INTO public.technicians (
  id,
  skills,
  service_area,
  availability_status,
  current_latitude,
  current_longitude,
  rating,
  total_jobs,
  completed_jobs,
  earnings,
  is_verified,
  is_active
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'juan@coolairpro.com'),
  ARRAY['Window Type Installation', 'Split Type Installation', 'Basic Repair', 'General Cleaning'],
  ARRAY['Quezon City', 'Manila', 'Caloocan'],
  'available',
  14.6760,
  121.0437,
  4.8,
  45,
  42,
  125000.00,
  true,
  true
) ON CONFLICT (id) DO NOTHING;

-- Add technician details for Maria
INSERT INTO public.technicians (
  id,
  skills,
  service_area,
  availability_status,
  current_latitude,
  current_longitude,
  rating,
  total_jobs,
  completed_jobs,
  earnings,
  is_verified,
  is_active
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'maria@coolairpro.com'),
  ARRAY['Cassette Type Installation', 'Advanced Repair', 'Dismantle', 'Inspection'],
  ARRAY['Makati', 'BGC', 'Ortigas', 'Mandaluyong'],
  'available',
  14.5547,
  121.0244,
  4.9,
  38,
  35,
  142000.00,
  true,
  true
) ON CONFLICT (id) DO NOTHING;

-- Add technician details for Pedro
INSERT INTO public.technicians (
  id,
  skills,
  service_area,
  availability_status,
  current_latitude,
  current_longitude,
  rating,
  total_jobs,
  completed_jobs,
  earnings,
  is_verified,
  is_active
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'pedro@coolairpro.com'),
  ARRAY['Window Type Installation', 'Split Type Installation', 'Basic Repair', 'General Cleaning', 'Dismantle'],
  ARRAY['Taguig', 'Pasig', 'Marikina', 'San Juan'],
  'available',
  14.5176,
  121.0509,
  4.7,
  52,
  48,
  156000.00,
  true,
  true
) ON CONFLICT (id) DO NOTHING;

-- Verify the setup
SELECT 
  u.email,
  p.full_name,
  ur.role,
  CASE WHEN t.id IS NOT NULL THEN 'Yes' ELSE 'No' END as has_technician_profile
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.technicians t ON u.id = t.id
WHERE u.email IN (
  'admin@coolairpro.com',
  'juan@coolairpro.com', 
  'maria@coolairpro.com',
  'pedro@coolairpro.com',
  'client@test.com'
)
ORDER BY u.email;
