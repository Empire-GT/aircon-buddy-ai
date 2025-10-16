import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { useChatConversations } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface ChatWidgetProps {
  className?: string;
}

const ChatWidget = ({ className = '' }: ChatWidgetProps) => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { data: conversations = [] } = useChatConversations();

  const unreadCount = conversations.reduce((total, conv) => total + conv.unread_count, 0);
  const recentConversations = conversations.slice(0, 3);

  const getConversationTitle = (conversation: any) => {
    const booking = conversation.booking;
    
    if (userRole === 'client') {
      return 'Technician';
    } else if (userRole === 'technician') {
      return 'Client';
    } else {
      return 'Client - Unassigned';
    }
  };

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-14 w-14 rounded-full shadow-lg relative"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Card className={`w-80 shadow-xl border-2 transition-all duration-300 ${
        isExpanded ? 'h-96' : 'h-64'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h3 className="font-semibold">Messages</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentConversations.map((conversation) => (
                <div
                  key={conversation.booking_id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="text-sm">
                        {getConversationTitle(conversation).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">
                        {getConversationTitle(conversation)}
                      </h4>
                      {conversation.last_message && (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.last_message.created_at), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.last_message?.message || conversation.booking.services?.name}
                    </p>
                  </div>
                </div>
              ))}
              
              {conversations.length > 3 && (
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    View All Messages
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button 
            className="w-full" 
            size="sm"
            onClick={() => {
              // Navigate to appropriate dashboard based on user role
              const dashboardPath = userRole === 'admin' ? '/dashboard/admin' : 
                                  userRole === 'technician' ? '/dashboard/technician' : 
                                  '/dashboard/client';
              navigate(dashboardPath);
            }}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Open Messages
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChatWidget;
