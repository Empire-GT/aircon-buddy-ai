-- Create user role enum
CREATE TYPE public.app_role AS ENUM ('client', 'technician', 'admin');

-- Create service category enum
CREATE TYPE public.service_category AS ENUM (
  'installation',
  'dismantle',
  'repair',
  'cleaning',
  'inspection'
);

-- Create booking status enum
CREATE TYPE public.booking_status AS ENUM (
  'pending',
  'confirmed',
  'assigned',
  'in_progress',
  'completed',
  'cancelled'
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create technicians table
CREATE TABLE public.technicians (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  skills TEXT[],
  service_area TEXT[],
  availability_status TEXT DEFAULT 'available',
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 0.0,
  total_jobs INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  earnings DECIMAL(10, 2) DEFAULT 0.0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category service_category NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  estimated_duration INTEGER, -- in minutes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) NOT NULL,
  status booking_status DEFAULT 'pending',
  service_address TEXT NOT NULL,
  service_city TEXT NOT NULL,
  service_latitude DECIMAL(10, 8),
  service_longitude DECIMAL(11, 8),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  notes TEXT,
  total_price DECIMAL(10, 2),
  commission DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for technicians
CREATE POLICY "Everyone can view active technicians"
  ON public.technicians FOR SELECT
  USING (is_active = true);

CREATE POLICY "Technicians can update own profile"
  ON public.technicians FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage technicians"
  ON public.technicians FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for services
CREATE POLICY "Everyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for bookings
CREATE POLICY "Clients can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Technicians can view assigned bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = technician_id);

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = client_id);

CREATE POLICY "Technicians can update assigned bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = technician_id);

CREATE POLICY "Admins can manage all bookings"
  ON public.bookings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  
  -- Assign default client role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at
  BEFORE UPDATE ON public.technicians
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default services
INSERT INTO public.services (category, name, description, base_price, estimated_duration) VALUES
('installation', 'Window Type Installation', 'Professional installation of window type air conditioner', 2500.00, 120),
('installation', 'Split Type Installation', 'Professional installation of split type air conditioner', 3500.00, 180),
('installation', 'Cassette Type Installation', 'Professional installation of cassette type air conditioner', 5000.00, 240),
('dismantle', 'Window Type Removal', 'Safe removal and dismantling of window type AC', 1500.00, 60),
('dismantle', 'Split Type Removal', 'Safe removal and dismantling of split type AC', 2000.00, 90),
('dismantle', 'Cassette Type Removal', 'Safe removal and dismantling of cassette type AC', 3000.00, 120),
('repair', 'Basic Repair & Troubleshooting', 'Diagnosis and repair of common AC issues', 1200.00, 90),
('repair', 'Advanced Repair', 'Complex repair work with parts replacement', 2500.00, 180),
('cleaning', 'General Cleaning - Window/Split', 'Deep cleaning service for window or split type AC', 800.00, 60),
('cleaning', 'General Cleaning - Cassette', 'Deep cleaning service for cassette type AC', 1200.00, 90),
('inspection', 'Basic Inspection', 'Visual inspection and performance check', 500.00, 45),
('inspection', 'Detailed Quotation', 'Comprehensive inspection with detailed quotation', 800.00, 60);