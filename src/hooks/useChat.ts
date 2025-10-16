import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export interface ChatMessage {
  id: string;
  booking_id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'image' | 'file' | 'location';
  metadata?: any;
  is_read: boolean;
  created_at: string;
  sender_profile?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface ChatConversation {
  booking_id: string;
  booking: {
    id: string;
    status: string;
    scheduled_date: string;
    scheduled_time: string;
    service_address: string;
    services: {
      name: string;
    };
    client_profiles?: {
      full_name: string;
      phone: string;
    };
    technician_profiles?: {
      full_name: string;
      phone: string;
    };
  };
  last_message?: ChatMessage;
  unread_count: number;
}

// Fetch chat messages for a specific booking
export const useChatMessages = (bookingId: string) => {
  return useQuery({
    queryKey: ['chat-messages', bookingId],
    queryFn: async (): Promise<ChatMessage[]> => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch chat messages: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!bookingId,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
};

// Fetch all chat conversations for the current user
export const useChatConversations = () => {
  return useQuery({
    queryKey: ['chat-conversations'],
    queryFn: async (): Promise<ChatConversation[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get all bookings where user is either client or technician
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          scheduled_date,
          scheduled_time,
          service_address,
          services (name)
        `)
        .or(`client_id.eq.${user.id},technician_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (bookingsError) {
        throw new Error(`Failed to fetch bookings: ${bookingsError.message}`);
      }

      if (!bookings || bookings.length === 0) return [];

      // Get the latest message and unread count for each booking
      const conversations: ChatConversation[] = [];
      
      for (const booking of bookings) {
        const { data: messages, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('booking_id', booking.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (messagesError) continue;

        const unreadCount = await supabase
          .from('chat_messages')
          .select('id', { count: 'exact' })
          .eq('booking_id', booking.id)
          .eq('is_read', false)
          .neq('sender_id', user.id);

        conversations.push({
          booking_id: booking.id,
          booking,
          last_message: messages?.[0],
          unread_count: unreadCount.count || 0,
        });
      }

      return conversations;
    },
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

// Send message mutation
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      bookingId, 
      message, 
      messageType = 'text',
      metadata 
    }: { 
      bookingId: string; 
      message: string; 
      messageType?: 'text' | 'image' | 'file' | 'location';
      metadata?: any;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          booking_id: bookingId,
          sender_id: user.id,
          message,
          message_type: messageType,
          metadata,
        });

      if (error) {
        throw new Error(`Failed to send message: ${error.message}`);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

// Mark messages as read mutation
export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('booking_id', bookingId)
        .neq('sender_id', user.id);

      if (error) {
        throw new Error(`Failed to mark messages as read: ${error.message}`);
      }
    },
    onSuccess: (bookingId) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    }
  });
};

// Real-time subscription hook for chat messages
export const useChatSubscription = (bookingId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!bookingId) return;

    const channel = supabase
      .channel(`chat-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          // Invalidate and refetch messages when new message is added
          queryClient.invalidateQueries({ queryKey: ['chat-messages', bookingId] });
          queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, queryClient]);
};
