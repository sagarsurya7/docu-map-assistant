
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex items-start max-w-[80%] ${
          isUser
            ? 'bg-medical text-white rounded-2xl rounded-tr-sm'
            : 'bg-muted rounded-2xl rounded-tl-sm'
        } p-3`}
      >
        {!isUser && (
          <Avatar className="h-6 w-6 mr-2 bg-medical/20">
            <Bot className="h-3 w-3 text-medical" />
          </Avatar>
        )}
        <div>
          <p className="text-sm whitespace-pre-line">{message.content}</p>
        </div>
        {isUser && (
          <Avatar className="h-6 w-6 ml-2 bg-white/20">
            <User className="h-3 w-3" />
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
