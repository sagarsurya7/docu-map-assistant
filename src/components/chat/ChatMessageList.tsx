import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage as ChatMessageType } from '@/types';
import ChatMessage from './ChatMessage';
import ChatTypingIndicator from './ChatTypingIndicator';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isTyping: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping]);

  return (
    <ScrollArea 
      ref={scrollAreaRef}
      className="h-full p-4 [&_.scrollbar]:w-2 [&_.scrollbar-track]:bg-transparent [&_.scrollbar-thumb]:bg-gray-200 [&_.scrollbar-thumb]:rounded-full [&_.scrollbar-thumb:hover]:bg-gray-300 [&_.scrollbar]:right-4"
      onWheel={(e) => {
        const scrollArea = scrollAreaRef.current;
        if (scrollArea) {
          scrollArea.scrollTop += e.deltaY;
          e.preventDefault();
        }
      }}
    >
      <div className="space-y-4 pr-2">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        
        {isTyping && <ChatTypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessageList;
