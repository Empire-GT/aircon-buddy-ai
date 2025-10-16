import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Sample chat messages for testing
const sampleMessages = [
  {
    message: "Hello! I'm your assigned technician for today's aircon cleaning service. I'll be arriving at 2:00 PM as scheduled.",
    isClientMessage: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    message: "Thank you for confirming! I have a few questions about your aircon unit. What's the brand and model?",
    isClientMessage: true,
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() // 1.5 hours ago
  },
  {
    message: "It's a Carrier window type, model 42QHC018DS. It's been making some noise lately, especially when it starts up.",
    isClientMessage: false,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
  },
  {
    message: "I see. That's a common issue with Carrier units. I'll bring some additional tools to check the compressor and clean the fan blades thoroughly. The noise should be resolved after the service.",
    isClientMessage: true,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
  },
  {
    message: "Perfect! I'm on my way now. Should arrive in about 15 minutes. Please make sure the area around the aircon is clear.",
    isClientMessage: false,
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() // 10 minutes ago
  },
  {
    message: "Great! I'll clear the area now. See you soon!",
    isClientMessage: true,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 minutes ago
  }
];

const SampleChatData = () => {
  const { user } = useAuth();

  useEffect(() => {
    const createSampleData = async () => {
      if (!user) return;

      try {
        // Check if we already have chat messages
        const { data: existingMessages } = await supabase
          .from('chat_messages')
          .select('id')
          .limit(1);

        if (existingMessages && existingMessages.length > 0) {
          console.log('Sample chat data already exists');
          return;
        }

        // Get or create a sample booking
        let { data: bookings } = await supabase
          .from('bookings')
          .select(`
            id,
            client_id,
            technician_id,
            services (name)
          `)
          .not('technician_id', 'is', null)
          .limit(1);

        if (!bookings || bookings.length === 0) {
          // Create a sample booking if none exists
          const { data: services } = await supabase
            .from('services')
            .select('id')
            .limit(1)
            .single();

          if (!services) {
            console.log('No services found, cannot create sample booking');
            return;
          }

          // Get other users for technician role
          const { data: allUsers } = await supabase.auth.admin.listUsers();
          const otherUser = allUsers?.users.find(u => u.id !== user.id);

          if (!otherUser) {
            console.log('No other users found, cannot create sample booking');
            return;
          }

          const { data: newBooking } = await supabase
            .from('bookings')
            .insert({
              client_id: user.id,
              technician_id: otherUser.id,
              service_id: services.id,
              status: 'assigned',
              service_address: '123 Sample Street, Makati City',
              service_city: 'Makati',
              scheduled_date: new Date().toISOString().split('T')[0],
              scheduled_time: '14:00:00',
              total_price: 800.00
            })
            .select()
            .single();

          if (newBooking) {
            bookings = [newBooking];
          }
        }

        if (!bookings || bookings.length === 0) {
          console.log('Could not create or find bookings');
          return;
        }

        const booking = bookings[0];

        // Create sample chat messages
        for (let i = 0; i < sampleMessages.length; i++) {
          const sampleMsg = sampleMessages[i];
          const senderId = sampleMsg.isClientMessage ? booking.client_id : booking.technician_id;

          await supabase
            .from('chat_messages')
            .insert({
              booking_id: booking.id,
              sender_id: senderId,
              message: sampleMsg.message,
              message_type: 'text',
              is_read: i < sampleMessages.length - 2, // Mark older messages as read
              created_at: sampleMsg.timestamp
            });
        }

        console.log('✅ Sample chat data created successfully!');
      } catch (error) {
        console.error('Error creating sample chat data:', error);
      }
    };

    createSampleData();
  }, [user]);

  return null; // This component doesn't render anything
};

export default SampleChatData;
