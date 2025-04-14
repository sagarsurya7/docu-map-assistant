
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';
import { ChatMessage } from '@/types';
import ChatMessageList from './chat/ChatMessageList';
import ChatInput from './chat/ChatInput';
import { initialMessages } from '@/utils/chatUtils';
import { sendChatMessage } from '@/api/chatService';
import { useToast } from '@/components/ui/use-toast';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const isMounted = useRef(true);
  const { toast } = useToast();

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSendMessage = async (input: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Send message to backend
      const response = await sendChatMessage(input);
      
      if (isMounted.current) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.response
        }]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again later.",
        variant: "destructive"
      });
      console.error('Chat error:', error);
    } finally {
      if (isMounted.current) {
        setIsTyping(false);
      }
    }
  };

  return (
    <Card className="flex flex-col h-full border-none shadow-none relative overflow-hidden">
      <CardHeader className="py-3 px-4 border-b flex-shrink-0">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 bg-medical text-white">
            <Bot className="h-4 w-4" />
          </Avatar>
          <CardTitle className="text-base ml-2">AI Health Assistant</CardTitle>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-hidden flex flex-col h-[calc(100%-60px)]">
        <div className="flex-1 overflow-y-auto">
          <ChatMessageList messages={messages} isTyping={isTyping} />
        </div>

        <CardFooter className="pt-3 px-4 pb-4 bg-white border-t mt-auto z-10 w-full sticky bottom-0">
          <ChatInput onSendMessage={handleSendMessage} />
        </CardFooter>
      </div>
    </Card>
  );
};

export default ChatBot;
