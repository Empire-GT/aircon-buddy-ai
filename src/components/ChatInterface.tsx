import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, Smile, Phone, Video } from 'lucide-react';
import { useChatMessages, useSendMessage, useMarkMessagesAsRead, useChatSubscription, ChatMessage } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface ChatInterfaceProps {
  bookingId: string;
  onClose?: () => void;
  className?: string;
}

const ChatInterface = ({ bookingId, onClose, className = '' }: ChatInterfaceProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: messages = [], isLoading } = useChatMessages(bookingId);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkMessagesAsRead();

  // Set up real-time subscription
  useChatSubscription(bookingId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (bookingId) {
      markAsRead.mutate(bookingId);
    }
  }, [bookingId, markAsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessage.isPending) return;

    try {
      await sendMessage.mutateAsync({
        bookingId,
        message: message.trim(),
        messageType: 'text'
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const isOwnMessage = (senderId: string) => {
    return senderId === user?.id;
  };

  if (isLoading) {
    return (
      <Card className={`h-[600px] flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full absolute -top-1 -right-1 border-2 border-background"></div>
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h3 className="font-semibold">Service Chat</h3>
            <p className="text-sm text-muted-foreground">Active now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4 min-h-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start the conversation by sending a message
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg: ChatMessage) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isOwnMessage(msg.sender_id) ? 'flex-row-reverse' : ''}`}
                  >
                    {!isOwnMessage(msg.sender_id) && (
                      <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback className="text-xs">
                          U
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[70%] ${isOwnMessage(msg.sender_id) ? 'text-right' : ''}`}>
                      {!isOwnMessage(msg.sender_id) && (
                        <p className="text-xs text-muted-foreground mb-1">
                          User
                        </p>
                      )}
                      
                      <div
                        className={`inline-block px-4 py-2 rounded-2xl ${
                          isOwnMessage(msg.sender_id)
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                      </div>
                      
                      <div className={`flex items-center gap-2 mt-1 ${isOwnMessage(msg.sender_id) ? 'justify-end' : ''}`}>
                        <p className="text-xs text-muted-foreground">
                          {formatMessageTime(msg.created_at)}
                        </p>
                        {isOwnMessage(msg.sender_id) && (
                          <div className="flex items-center gap-1">
                            {msg.is_read ? (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            ) : (
                              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarFallback className="text-xs">TC</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted px-4 py-2 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="pr-20"
              disabled={sendMessage.isPending}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={!message.trim() || sendMessage.isPending}
            className="px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatInterface;
