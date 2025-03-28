
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/types';
import { Bot, Send, User, XCircle, MicIcon, Image, Paperclip } from 'lucide-react';

const initialMessages: ChatMessage[] = [
  {
    role: 'assistant',
    content: 'Hello! I\'m your AI medical assistant. How can I help you today? You can describe your symptoms, ask health questions, or find nearby specialists.'
  }
];

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Example symptoms-to-conditions mapping for demo
  const symptomsMapping: Record<string, string[]> = {
    headache: [
      'This could be due to stress, dehydration, or migraine.',
      'I recommend consulting with a Neurologist if it persists.',
      'Would you like to see available neurologists in Pune?'
    ],
    fever: [
      'Fever could indicate an infection or inflammation.',
      'If it's accompanied by other symptoms, consider seeing a General Physician.',
      'Make sure to stay hydrated and rest.'
    ],
    cough: [
      'A cough could be due to a cold, allergies, or respiratory infection.',
      'If it persists for more than a week, you should consult a Pulmonologist.',
      'Is it a dry cough or do you have phlegm?'
    ],
    'chest pain': [
      'Chest pain can be serious and may indicate heart problems.',
      'Please consult a Cardiologist immediately.',
      'If severe, please call emergency services or visit the nearest hospital.'
    ],
    fatigue: [
      'Fatigue can be caused by various factors including stress, poor sleep, or medical conditions.',
      'If persistent, consider consulting an Endocrinologist to check for hormonal imbalances.',
      'Are you experiencing any other symptoms alongside fatigue?'
    ]
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
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

  const generateResponse = (userInput: string): string => {
    // Simple pattern matching for demo purposes
    for (const [symptom, responses] of Object.entries(symptomsMapping)) {
      if (userInput.includes(symptom)) {
        return responses.join(' ');
      }
    }
    
    if (userInput.includes('hello') || userInput.includes('hi')) {
      return 'Hello! How are you feeling today? Can you describe any symptoms you\'re experiencing?';
    } else if (userInput.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    } else if (userInput.includes('doctor') || userInput.includes('appointment')) {
      return 'I can help you find doctors in Pune. Could you specify what type of specialist you\'re looking for?';
    } else if (userInput.includes('emergency')) {
      return 'If this is a medical emergency, please call emergency services immediately or visit your nearest emergency room.';
    } else {
      return 'To provide you with better assistance, could you share more details about your symptoms or what specific medical information you\'re looking for?';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-medical text-white rounded-2xl rounded-tr-sm'
                    : 'bg-muted rounded-2xl rounded-tl-sm'
                } p-3`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-6 w-6 mr-2 bg-medical/20">
                    <Bot className="h-3 w-3 text-medical" />
                  </Avatar>
                )}
                <div>
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-6 w-6 ml-2 bg-white/20">
                    <User className="h-3 w-3" />
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
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
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <CardFooter className="pt-0 px-4 pb-4">
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
      </CardFooter>
    </Card>
  );
};

export default ChatBot;
