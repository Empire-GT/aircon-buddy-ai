# Creating Test Users for Aircon Buddy AI

This document explains how to create test users for the Aircon Buddy AI application.

## Overview

The database migration `20251011220952_seed_users.sql` creates service areas and services, but **does not create user accounts**. User accounts must be created through Supabase Auth, which will automatically trigger the creation of profiles and roles via database triggers.

## Test User Accounts to Create

### Admin User
- **Email**: `admin@coolairpro.com`
- **Password**: `password123`
- **Role**: Admin (assign after signup)

### Technician Users
- **Email**: `juan@coolairpro.com`
- **Password**: `password123`
- **Role**: Technician (assign after signup)

- **Email**: `maria@coolairpro.com`
- **Password**: `password123`
- **Role**: Technician (assign after signup)

- **Email**: `pedro@coolairpro.com`
- **Password**: `password123`
- **Role**: Technician (assign after signup)

### Client User
- **Email**: `client@test.com`
- **Password**: `password123`
- **Role**: Client (default role)

## How to Create Users

### Method 1: Through the Application UI
1. Start the application
2. Navigate to the signup page
3. Create accounts with the email addresses above
4. After signup, assign appropriate roles through the admin panel

### Method 2: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" and create accounts with the email addresses above
4. Use the SQL editor to assign roles:

```sql
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
```

### Method 3: Using Supabase CLI
```bash
# Create users via CLI (if you have the Supabase CLI installed)
supabase auth users create admin@coolairpro.com --password password123
supabase auth users create juan@coolairpro.com --password password123
supabase auth users create maria@coolairpro.com --password password123
supabase auth users create pedro@coolairpro.com --password password123
supabase auth users create client@test.com --password password123
```

## What Happens Automatically

When a user signs up, the following happens automatically via database triggers:

1. A profile is created in the `profiles` table
2. A default 'client' role is assigned in the `user_roles` table
3. The user can immediately start using the application

## Manual Role Assignment

After creating users, you need to manually assign the correct roles:

```sql
-- For admin user
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@coolairpro.com');

-- For technician users
UPDATE public.user_roles 
SET role = 'technician' 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('juan@coolairpro.com', 'maria@coolairpro.com', 'pedro@coolairpro.com')
);
```

## Adding Technician Details

For technician users, you'll also want to add technician-specific information:

```sql
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
);

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
);

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
);
```

## Verification

After creating users and assigning roles, you can verify everything is set up correctly:

```sql
-- Check all users and their roles
SELECT 
  u.email,
  p.full_name,
  ur.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.email;

-- Check technician details
SELECT 
  u.email,
  p.full_name,
  t.skills,
  t.service_area,
  t.rating
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
JOIN public.technicians t ON u.id = t.id
ORDER BY u.email;
```