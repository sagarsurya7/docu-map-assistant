
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

const ChatTypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
        <Avatar className="h-6 w-6 mr-2 bg-medical/20">
          <Bot className="h-3 w-3 text-medical" />
        </Avatar>
        <div className="flex space-x-1 items-center h-6">
          <div className="w-2 h-2 rounded-full bg-medical/60 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-medical/60 animate-pulse delay-150"></div>
          <div className="w-2 h-2 rounded-full bg-medical/60 animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatTypingIndicator;
