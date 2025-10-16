import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, ArrowLeft } from 'lucide-react';
import ChatList from './ChatList';
import ChatInterface from './ChatInterface';

interface ChatWindowProps {
  className?: string;
  defaultView?: 'list' | 'chat';
  defaultBookingId?: string;
}

const ChatWindow = ({ 
  className = '', 
  defaultView = 'list',
  defaultBookingId 
}: ChatWindowProps) => {
  const [currentView, setCurrentView] = useState<'list' | 'chat'>(defaultView);
  const [selectedBookingId, setSelectedBookingId] = useState<string | undefined>(defaultBookingId);

  const handleSelectConversation = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setCurrentView('chat');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedBookingId(undefined);
  };

  const handleCloseChat = () => {
    setCurrentView('list');
    setSelectedBookingId(undefined);
  };

  if (currentView === 'chat' && selectedBookingId) {
    return (
      <div className={`flex flex-col ${className}`}>
        {/* Chat Header with Back Button */}
        <div className="flex items-center gap-3 p-4 border-b bg-background">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            className="md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h2 className="font-semibold">Service Chat</h2>
          </div>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseChat}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Chat Interface */}
        <ChatInterface 
          bookingId={selectedBookingId} 
          onClose={handleCloseChat}
          className="flex-1 border-0 rounded-none"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <ChatList 
        onSelectConversation={handleSelectConversation}
        selectedBookingId={selectedBookingId}
        className="h-full"
      />
    </div>
  );
};

export default ChatWindow;
