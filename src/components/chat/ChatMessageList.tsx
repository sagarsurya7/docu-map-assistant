
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

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
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
