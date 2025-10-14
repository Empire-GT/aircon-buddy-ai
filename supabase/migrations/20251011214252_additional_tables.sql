-- Additional tables for enhanced aircon buddy AI functionality

-- Create review rating enum
CREATE TYPE public.review_rating AS ENUM ('1', '2', '3', '4', '5');

-- Create notification type enum
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

-- Create payment status enum
CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'
);

-- Create payment method enum
CREATE TYPE public.payment_method AS ENUM (
  'cash',
  'gcash',
  'paymaya',
  'bank_transfer',
  'credit_card'
);

-- Create reviews table
CREATE TABLE public.reviews (
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

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional data like booking_id, etc.
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
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

-- Create chat_messages table for real-time communication
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- text, image, file, location
  metadata JSONB, -- For file paths, location data, etc.
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create service_areas table for better location management
CREATE TABLE public.service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create technician_service_areas junction table
CREATE TABLE public.technician_service_areas (
  technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE,
  service_area_id UUID REFERENCES service_areas(id) ON DELETE CASCADE,
  PRIMARY KEY (technician_id, service_area_id)
);

-- Create equipment table for tracking AC units
CREATE TABLE public.equipment (
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

-- Create booking_equipment junction table
CREATE TABLE public.booking_equipment (
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  PRIMARY KEY (booking_id, equipment_id)
);

-- Enable RLS on new tables
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_equipment ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Everyone can view public reviews"
  ON public.reviews FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own reviews"
  ON public.reviews FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = technician_id);

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

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = client_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true); -- Allow system to create notifications

-- RLS Policies for payments
CREATE POLICY "Users can view payments for their bookings"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id 
      AND (client_id = auth.uid() OR technician_id = auth.uid())
    )
  );

CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage payments"
  ON public.payments FOR ALL
  USING (true); -- Allow payment gateway integrations

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages for their bookings"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id 
      AND (client_id = auth.uid() OR technician_id = auth.uid())
    )
  );

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

-- RLS Policies for service_areas
CREATE POLICY "Everyone can view active service areas"
  ON public.service_areas FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage service areas"
  ON public.service_areas FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for technician_service_areas
CREATE POLICY "Everyone can view technician service areas"
  ON public.technician_service_areas FOR SELECT
  USING (true);

CREATE POLICY "Technicians can manage their service areas"
  ON public.technician_service_areas FOR ALL
  USING (auth.uid() = technician_id);

-- RLS Policies for equipment
CREATE POLICY "Users can view their own equipment"
  ON public.equipment FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Users can manage their own equipment"
  ON public.equipment FOR ALL
  USING (auth.uid() = client_id);

-- RLS Policies for booking_equipment
CREATE POLICY "Users can view equipment for their bookings"
  ON public.booking_equipment FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id 
      AND (client_id = auth.uid() OR technician_id = auth.uid())
    )
  );

-- Add update triggers for new tables
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default service areas (Philippines)
INSERT INTO public.service_areas (name, city, province) VALUES
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
('Pateros', 'Pateros', 'Metro Manila');

-- Create indexes for better performance
CREATE INDEX idx_reviews_technician_id ON public.reviews(technician_id);
CREATE INDEX idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_chat_messages_booking_id ON public.chat_messages(booking_id);
CREATE INDEX idx_equipment_client_id ON public.equipment(client_id);
CREATE INDEX idx_technician_service_areas_technician_id ON public.technician_service_areas(technician_id);
CREATE INDEX idx_booking_equipment_booking_id ON public.booking_equipment(booking_id);

