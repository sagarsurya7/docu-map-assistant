
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MicIcon, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border rounded-lg w-full flex items-center overflow-hidden bg-white">
      <Input
        placeholder="Type your symptoms or question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="flex items-center px-3 gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
        >
          <MicIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          onClick={handleSendMessage}
          className="h-8 w-8 rounded-full bg-medical hover:bg-medical-dark text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
