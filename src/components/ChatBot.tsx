
import React, { useState } from 'react';
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

  const handleSendMessage = (input: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const response = generateResponse(input.toLowerCase());
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
      
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Card className="flex flex-col h-full border-none shadow-none">
      <CardHeader className="py-3 px-4 border-b flex-shrink-0">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 bg-medical text-white">
            <Bot className="h-4 w-4" />
          </Avatar>
          <CardTitle className="text-base ml-2">AI Health Assistant</CardTitle>
        </div>
      </CardHeader>

      <ChatMessageList messages={messages} isTyping={isTyping} />

      <CardFooter className="pt-0 px-4 pb-4 sticky bottom-0 bg-white">
        <ChatInput onSendMessage={handleSendMessage} />
      </CardFooter>
    </Card>
  );
};

export default ChatBot;
