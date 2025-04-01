
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';
import { ChatMessage } from '@/types';
import ChatMessageList from './chat/ChatMessageList';
import ChatInput from './chat/ChatInput';
import { initialMessages, generateResponse } from '@/utils/chatUtils';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSendMessage = (input: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate AI response after a delay
    const timer = setTimeout(() => {
      if (isMounted.current) {
        const response = generateResponse(input.toLowerCase());
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response
        }]);
        
        setIsTyping(false);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
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
