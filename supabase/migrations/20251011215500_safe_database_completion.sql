-- Safe database completion migration
-- This migration handles existing objects gracefully

-- Create enums only if they don't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('client', 'technician', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.service_category AS ENUM (
      'installation',
      'dismantle',
      'repair',
      'cleaning',
      'inspection'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.booking_status AS ENUM (
      'pending',
      'confirmed',
      'assigned',
      'in_progress',
      'completed',
      'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.review_rating AS ENUM ('1', '2', '3', '4', '5');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.notification_type AS ENUM (
      'booking_created',
      'booking_confirmed',
      'booking_assigned',
      'booking_started',
      'booking_completed',
      'booking_cancelled',
      'payment_received',
      'review_received',
      'system_announcement'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_status AS ENUM (
      'pending',
      'processing',
      'completed',
      'failed',
      'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_method AS ENUM (
      'cash',
      'gcash',
      'paymaya',
      'bank_transfer',
      'credit_card'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create tables only if they don't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.technicians (
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

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category service_category NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  estimated_duration INTEGER, -- in minutes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brand TEXT,
  model TEXT,
  type TEXT, -- window, split, cassette, etc.
  capacity TEXT, -- 1HP, 1.5HP, 2HP, etc.
  installation_date DATE,
  last_service_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookings (
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

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE NOT NULL,
  rating review_rating NOT NULL,
  comment TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(booking_id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional data like booking_id, etc.
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'PHP',
  method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  transaction_id TEXT, -- External payment gateway transaction ID
  gateway_response JSONB, -- Store gateway response data
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- text, image, file, location
  metadata JSONB, -- For file paths, location data, etc.
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.technician_service_areas (
  technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE,
  service_area_id UUID REFERENCES service_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (technician_id, service_area_id)
);

CREATE TABLE IF NOT EXISTS public.booking_equipment (
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  PRIMARY KEY (booking_id, equipment_id)
);

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_equipment ENABLE ROW LEVEL SECURITY;

-- Create or replace functions (safe to run multiple times)
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_technicians_updated_at ON public.technicians;
CREATE TRIGGER update_technicians_updated_at
  BEFORE UPDATE ON public.technicians
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_equipment_updated_at ON public.equipment;
CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create policies (drop existing ones first to avoid conflicts)
-- User roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Technicians policies
DROP POLICY IF EXISTS "Everyone can view active technicians" ON public.technicians;
CREATE POLICY "Everyone can view active technicians"
  ON public.technicians FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Technicians can update own profile" ON public.technicians;
CREATE POLICY "Technicians can update own profile"
  ON public.technicians FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage technicians" ON public.technicians;
CREATE POLICY "Admins can manage technicians"
  ON public.technicians FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Services policies
DROP POLICY IF EXISTS "Everyone can view active services" ON public.services;
CREATE POLICY "Everyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Service areas policies
DROP POLICY IF EXISTS "Everyone can view active service areas" ON public.service_areas;
CREATE POLICY "Everyone can view active service areas"
  ON public.service_areas FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage service areas" ON public.service_areas;
CREATE POLICY "Admins can manage service areas"
  ON public.service_areas FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Equipment policies
DROP POLICY IF EXISTS "Users can view their own equipment" ON public.equipment;
CREATE POLICY "Users can view their own equipment"
  ON public.equipment FOR SELECT
  USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Users can manage their own equipment" ON public.equipment;
CREATE POLICY "Users can manage their own equipment"
  ON public.equipment FOR ALL
  USING (auth.uid() = client_id);

-- Bookings policies
DROP POLICY IF EXISTS "Clients can view own bookings" ON public.bookings;
CREATE POLICY "Clients can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Technicians can view assigned bookings" ON public.bookings;
CREATE POLICY "Technicians can view assigned bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = technician_id);

DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Clients can create bookings" ON public.bookings;
CREATE POLICY "Clients can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Clients can update own bookings" ON public.bookings;
CREATE POLICY "Clients can update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Technicians can update assigned bookings" ON public.bookings;
CREATE POLICY "Technicians can update assigned bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = technician_id);

DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
CREATE POLICY "Admins can manage all bookings"
  ON public.bookings FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Reviews policies
DROP POLICY IF EXISTS "Everyone can view public reviews" ON public.reviews;
CREATE POLICY "Everyone can view public reviews"
  ON public.reviews FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS "Users can view their own reviews" ON public.reviews;
CREATE POLICY "Users can view their own reviews"
  ON public.reviews FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = technician_id);

DROP POLICY IF EXISTS "Clients can create reviews for their bookings" ON public.reviews;
CREATE POLICY "Clients can create reviews for their bookings"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id 
      AND client_id = auth.uid() 
      AND status = 'completed'
    )
  );

DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = client_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true); -- Allow system to create notifications

-- Payments policies
DROP POLICY IF EXISTS "Users can view payments for their bookings" ON public.payments;
CREATE POLICY "Users can view payments for their bookings"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id 
      AND (client_id = auth.uid() OR technician_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "System can manage payments" ON public.payments;
CREATE POLICY "System can manage payments"
  ON public.payments FOR ALL
  USING (true); -- Allow payment gateway integrations

-- Chat messages policies
DROP POLICY IF EXISTS "Users can view messages for their bookings" ON public.chat_messages;
CREATE POLICY "Users can view messages for their bookings"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id 
      AND (client_id = auth.uid() OR technician_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can send messages for their bookings" ON public.chat_messages;
CREATE POLICY "Users can send messages for their bookings"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id 
      AND (client_id = auth.uid() OR technician_id = auth.uid())
    )
  );

-- Technician service areas policies
DROP POLICY IF EXISTS "Everyone can view technician service areas" ON public.technician_service_areas;
CREATE POLICY "Everyone can view technician service areas"
  ON public.technician_service_areas FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Technicians can manage their service areas" ON public.technician_service_areas;
CREATE POLICY "Technicians can manage their service areas"
  ON public.technician_service_areas FOR ALL
  USING (auth.uid() = technician_id);

-- Booking equipment policies
DROP POLICY IF EXISTS "Users can view equipment for their bookings" ON public.booking_equipment;
CREATE POLICY "Users can view equipment for their bookings"
  ON public.booking_equipment FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id 
      AND (client_id = auth.uid() OR technician_id = auth.uid())
    )
  );

-- Insert default services (only if they don't exist)
INSERT INTO public.services (category, name, description, base_price, estimated_duration) 
SELECT * FROM (VALUES
('installation'::service_category, 'Window Type Installation', 'Professional installation of window type air conditioner', 2500.00, 120),
('installation'::service_category, 'Split Type Installation', 'Professional installation of split type air conditioner', 3500.00, 180),
('installation'::service_category, 'Cassette Type Installation', 'Professional installation of cassette type air conditioner', 5000.00, 240),
('dismantle'::service_category, 'Window Type Removal', 'Safe removal and dismantling of window type AC', 1500.00, 60),
('dismantle'::service_category, 'Split Type Removal', 'Safe removal and dismantling of split type AC', 2000.00, 90),
('dismantle'::service_category, 'Cassette Type Removal', 'Safe removal and dismantling of cassette type AC', 3000.00, 120),
('repair'::service_category, 'Basic Repair & Troubleshooting', 'Diagnosis and repair of common AC issues', 1200.00, 90),
('repair'::service_category, 'Advanced Repair', 'Complex repair work with parts replacement', 2500.00, 180),
('cleaning'::service_category, 'General Cleaning - Window/Split', 'Deep cleaning service for window or split type AC', 800.00, 60),
('cleaning'::service_category, 'General Cleaning - Cassette', 'Deep cleaning service for cassette type AC', 1200.00, 90),
('inspection'::service_category, 'Basic Inspection', 'Visual inspection and performance check', 500.00, 45),
('inspection'::service_category, 'Detailed Quotation', 'Comprehensive inspection with detailed quotation', 800.00, 60)
) AS v(category, name, description, base_price, estimated_duration)
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE services.name = v.name);

-- Insert default service areas (only if they don't exist)
INSERT INTO public.service_areas (name, city, province) 
SELECT * FROM (VALUES
('Makati CBD', 'Makati', 'Metro Manila'),
('BGC', 'Taguig', 'Metro Manila'),
('Ortigas', 'Pasig', 'Metro Manila'),
('Quezon City', 'Quezon City', 'Metro Manila'),
('Manila', 'Manila', 'Metro Manila'),
('Mandaluyong', 'Mandaluyong', 'Metro Manila'),
('San Juan', 'San Juan', 'Metro Manila'),
('Pasay', 'Pasay', 'Metro Manila'),
('Parañaque', 'Parañaque', 'Metro Manila'),
('Las Piñas', 'Las Piñas', 'Metro Manila'),
('Muntinlupa', 'Muntinlupa', 'Metro Manila'),
('Marikina', 'Marikina', 'Metro Manila'),
('Caloocan', 'Caloocan', 'Metro Manila'),
('Malabon', 'Malabon', 'Metro Manila'),
('Navotas', 'Navotas', 'Metro Manila'),
('Valenzuela', 'Valenzuela', 'Metro Manila'),
('Pateros', 'Pateros', 'Metro Manila')
) AS v(name, city, province)
WHERE NOT EXISTS (SELECT 1 FROM public.service_areas WHERE service_areas.name = v.name);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_reviews_technician_id ON public.reviews(technician_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_booking_id ON public.chat_messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_equipment_client_id ON public.equipment(client_id);
CREATE INDEX IF NOT EXISTS idx_technician_service_areas_technician_id ON public.technician_service_areas(technician_id);
CREATE INDEX IF NOT EXISTS idx_booking_equipment_booking_id ON public.booking_equipment(booking_id);
