import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

interface AIChatProps {
  className?: string;
}

const AIChat = ({ className }: AIChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI assistant. How can I help you with your aircon service needs today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Booking related queries
    if (message.includes('book') || message.includes('schedule') || message.includes('appointment')) {
      return "To book a service, click the 'Book Now' button on our homepage or visit /booking. You can select your service type, preferred date and time, and we'll match you with a qualified technician.";
    }
    
    // Pricing queries
    if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
      return "Our pricing is transparent and competitive. General cleaning starts at ₱500, deep cleaning from ₱800, repairs from ₱1,200, and installations from ₱2,500. You can get a free quote by booking an inspection.";
    }
    
    // Service areas
    if (message.includes('area') || message.includes('location') || message.includes('serve')) {
      return "We currently serve Metro Manila and surrounding areas including Makati, Quezon City, Taguig, Pasig, and more. Check our service areas page for the complete list.";
    }
    
    // Technician queries
    if (message.includes('technician') || message.includes('expert') || message.includes('certified')) {
      return "Yes, all our technicians are certified professionals with extensive experience in air conditioning installation, repair, and maintenance. They are verified, trained, and rated by customers.";
    }
    
    // Warranty queries
    if (message.includes('warranty') || message.includes('guarantee')) {
      return "We provide warranties on all our services. Installation services come with a 1-year warranty, while repairs and maintenance have a 90-day warranty.";
    }
    
    // Reschedule queries
    if (message.includes('reschedule') || message.includes('cancel') || message.includes('change')) {
      return "Yes, you can reschedule your appointment up to 24 hours before your scheduled time through your dashboard or by contacting our support team at +63 123 456 7890.";
    }
    
    // Payment queries
    if (message.includes('payment') || message.includes('pay') || message.includes('cash')) {
      return "We accept multiple payment methods including cash, GCash, PayMaya, bank transfers, and credit cards. Payment is due upon completion of service.";
    }
    
    // Emergency queries
    if (message.includes('emergency') || message.includes('urgent') || message.includes('asap')) {
      return "For emergency services, please call us immediately at +63 123 456 7890. We have technicians available for urgent repairs and can often provide same-day service.";
    }
    
    // General greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to help you with any questions about our aircon services. You can ask me about booking, pricing, service areas, or anything else!";
    }
    
    // Default response
    return "I understand you're looking for information about our aircon services. For specific questions about booking, pricing, or technical support, I recommend contacting our support team at +63 123 456 7890 or emailing support@proqual.com. Is there anything specific I can help you with?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {/* Chat Window */}
      {isOpen && (
        <Card className={cn(
          "w-80 h-96 flex flex-col shadow-2xl border-2 border-accent/20 transition-all duration-300",
          isMinimized ? "h-12" : "h-96"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-accent/5">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-accent rounded-full">
                <Bot className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <Badge variant="secondary" className="text-xs">Online</Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
                className="h-6 w-6 p-0"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.sender === 'ai' && (
                      <div className="p-1 bg-accent/10 rounded-full self-end">
                        <Bot className="h-3 w-3 text-accent" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] p-2 rounded-lg text-sm",
                        message.sender === 'user'
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="p-1 bg-primary/10 rounded-full self-end">
                        <User className="h-3 w-3 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="p-1 bg-accent/10 rounded-full self-end">
                      <Bot className="h-3 w-3 text-accent" />
                    </div>
                    <div className="bg-secondary text-secondary-foreground p-2 rounded-lg text-sm">
                      <div className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>AI is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about our services..."
                    className="flex-1 text-sm"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="sm"
                    className="px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 bg-accent hover:bg-accent/90"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default AIChat;

