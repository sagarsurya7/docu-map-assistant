import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage as ChatMessageType } from '@/types';
import ChatMessage from './ChatMessage';
import ChatTypingIndicator from './ChatTypingIndicator';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isTyping: boolean;
  onSeeOnMap?: (doctorId: string, location: { lat: number; lng: number }) => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isTyping, onSeeOnMap }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-full px-4 py-4 overflow-y-auto">
      <div className="space-y-4 pb-2">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message} 
            onSeeOnMap={onSeeOnMap}
          />
        ))}
        
        {isTyping && <ChatTypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessageList;
