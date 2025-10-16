import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowLeft, X } from 'lucide-react';
import MessagingSidebar from './MessagingSidebar';
import ChatInterface from './ChatInterface';

interface MessagingLayoutProps {
  className?: string;
}

const MessagingLayout = ({ className = '' }: MessagingLayoutProps) => {
  const [selectedBookingId, setSelectedBookingId] = useState<string | undefined>();
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSelectConversation = (bookingId: string) => {
    setSelectedBookingId(bookingId);
  };

  const handleBackToList = () => {
    setSelectedBookingId(undefined);
  };

  const handleCloseChat = () => {
    setSelectedBookingId(undefined);
  };

  return (
    <div className={`flex h-full bg-background ${className}`}>
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-border`}>
        <MessagingSidebar 
          onSelectConversation={handleSelectConversation}
          selectedBookingId={selectedBookingId}
          className="h-full"
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedBookingId ? (
          <>
            {/* Chat Header with Back Button */}
            <div className="flex items-center gap-3 p-4 border-b bg-background flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="lg:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <h2 className="font-semibold">Service Chat</h2>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="hidden lg:flex"
                >
                  {showSidebar ? 'Hide' : 'Show'} Sidebar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseChat}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Chat Interface */}
            <div className="flex-1 min-h-0">
              <ChatInterface 
                bookingId={selectedBookingId} 
                onClose={handleCloseChat}
                className="h-full border-0 rounded-none"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <Card className="p-12 text-center max-w-lg w-full">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Welcome to Admin Messages</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Select a conversation from the sidebar to monitor and participate in client-technician discussions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                  <MessageCircle className="h-6 w-6 mb-2" />
                  <p className="font-medium">Real-time messaging</p>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                  <MessageCircle className="h-6 w-6 mb-2" />
                  <p className="font-medium">Service discussions</p>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                  <MessageCircle className="h-6 w-6 mb-2" />
                  <p className="font-medium">File sharing</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingLayout;
