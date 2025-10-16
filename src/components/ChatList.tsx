import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Search, 
  Calendar, 
  MapPin, 
  User, 
  Clock,
  Plus
} from 'lucide-react';
import { useChatConversations, ChatConversation } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  onSelectConversation: (bookingId: string) => void;
  selectedBookingId?: string;
  className?: string;
}

const ChatList = ({ onSelectConversation, selectedBookingId, className = '' }: ChatListProps) => {
  const { user, userRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: conversations = [], isLoading } = useChatConversations();

  const filteredConversations = conversations.filter(conversation => {
    const searchLower = searchTerm.toLowerCase();
    const booking = conversation.booking;
    
    return (
      booking.services?.name?.toLowerCase().includes(searchLower) ||
      booking.client_profiles?.full_name?.toLowerCase().includes(searchLower) ||
      booking.technician_profiles?.full_name?.toLowerCase().includes(searchLower) ||
      booking.service_address?.toLowerCase().includes(searchLower) ||
      conversation.last_message?.message?.toLowerCase().includes(searchLower)
    );
  });

  const getConversationTitle = (conversation: ChatConversation) => {
    const booking = conversation.booking;
    
    if (userRole === 'client') {
      return booking.technician_profiles?.full_name || 'Technician';
    } else if (userRole === 'technician') {
      return booking.client_profiles?.full_name || 'Client';
    } else {
      // Admin view
      return `${booking.client_profiles?.full_name || 'Client'} - ${booking.technician_profiles?.full_name || 'Unassigned'}`;
    }
  };

  const getConversationSubtitle = (conversation: ChatConversation) => {
    const booking = conversation.booking;
    return `${booking.services?.name} • ${booking.service_address}`;
  };

  const formatLastMessageTime = (timestamp?: string) => {
    if (!timestamp) return '';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-yellow-100 text-yellow-700';
      case 'assigned': return 'bg-purple-100 text-purple-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <Card className={`h-[600px] flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
          </h2>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center p-8">
                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No conversations yet</h3>
                <p className="text-muted-foreground text-sm">
                  {searchTerm ? 'No conversations match your search.' : 'Start a conversation by booking a service.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.booking_id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    selectedBookingId === conversation.booking_id
                      ? 'bg-accent/10 border border-accent'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onSelectConversation(conversation.booking_id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>
                          {getConversationTitle(conversation).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.unread_count > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">
                          {getConversationTitle(conversation)}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(conversation.booking.status)}`}
                          >
                            {conversation.booking.status.replace('_', ' ')}
                          </Badge>
                          {conversation.last_message && (
                            <span className="text-xs text-muted-foreground">
                              {formatLastMessageTime(conversation.last_message.created_at)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 truncate">
                        {getConversationSubtitle(conversation)}
                      </p>
                      
                      {conversation.last_message ? (
                        <p className="text-sm truncate">
                          {conversation.last_message.message}
                        </p>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(conversation.booking.scheduled_date).toLocaleDateString()} at {conversation.booking.scheduled_time}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </Card>
  );
};

export default ChatList;
