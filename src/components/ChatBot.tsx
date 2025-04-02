import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';
import { ChatMessage } from '@/types';
import ChatMessageList from './chat/ChatMessageList';
import ChatInput from './chat/ChatInput';
import { initialMessages, generateResponse } from '@/utils/chatUtils';
import { Doctor } from '@/types';

interface ChatBotProps {
  doctors: Doctor[];
  onSearchDoctors: (searchTerm: string) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ doctors, onSearchDoctors }) => {
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
    
    // Check if the message contains a doctor search query
    const searchTerms = ['find', 'search', 'look for', 'doctor', 'specialist'];
    const isSearchQuery = searchTerms.some(term => input.toLowerCase().includes(term));
    
    if (isSearchQuery) {
      // Extract search terms from the query
      const searchTerm = input.toLowerCase();
      onSearchDoctors(searchTerm);
      
      // Generate a response about the search
      const timer = setTimeout(() => {
        if (isMounted.current) {
          const matchingDoctors = doctors.filter(doctor => 
            doctor.name.toLowerCase().includes(searchTerm) ||
            doctor.specialty.toLowerCase().includes(searchTerm) ||
            doctor.address.toLowerCase().includes(searchTerm)
          );
          
          const response = matchingDoctors.length > 0
            ? `I found ${matchingDoctors.length} doctor(s) matching your search. You can find them in the list on the left.`
            : "I couldn't find any doctors matching your search. Try using different keywords or check the list on the left.";
          
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: response
          }]);
          
          setIsTyping(false);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    // Handle regular chat messages
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
    <Card className="flex flex-col h-[700px] border-none shadow-none relative">
      <CardHeader className="py-3 px-4 border-b flex-shrink-0">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 bg-medical text-white">
            <Bot className="h-4 w-4" />
          </Avatar>
          <CardTitle className="text-base ml-2">AI Health Assistant</CardTitle>
        </div>
      </CardHeader>

      <div className="flex-1 min-h-0 flex flex-col relative">
        <div className="flex-1 overflow-hidden">
          <ChatMessageList messages={messages} isTyping={isTyping} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white border-t">
          <CardFooter className="pt-3 px-4 pb-4">
            <ChatInput onSendMessage={handleSendMessage} />
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default ChatBot;
