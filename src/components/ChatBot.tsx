import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/types';
import { Bot, Send, User, XCircle, MicIcon, Image, Paperclip } from 'lucide-react';
import { doctors } from '../data/doctors';

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
      'If it is accompanied by other symptoms, consider seeing a General Physician.',
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

  // Medical specialties mapping
  const specialtiesMapping: Record<string, string[]> = {
    cardiologist: ['heart', 'chest pain', 'blood pressure', 'cardiovascular'],
    neurologist: ['headache', 'migraine', 'brain', 'nerve', 'stroke'],
    pediatrician: ['child', 'baby', 'infant', 'children'],
    orthopedic: ['bone', 'joint', 'fracture', 'back pain', 'knee'],
    dermatologist: ['skin', 'rash', 'acne', 'hair loss'],
    gynecologist: ['pregnancy', 'menstrual', 'women health', 'period'],
    psychiatrist: ['depression', 'anxiety', 'mental health', 'stress'],
    endocrinologist: ['diabetes', 'thyroid', 'hormone', 'fatigue']
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

  const findDoctorsBySpecialty = (specialty: string): string => {
    const matchingDoctors = doctors.filter(
      doctor => doctor.specialty.toLowerCase() === specialty.toLowerCase()
    );
    
    if (matchingDoctors.length === 0) {
      return `I couldn't find any ${specialty} in our database. Would you like to search for another specialty?`;
    }
    
    let response = `I found ${matchingDoctors.length} ${specialty}(s) in Pune:\n\n`;
    matchingDoctors.forEach(doctor => {
      response += `- ${doctor.name}: ${doctor.address}\n  Rating: ${doctor.rating}/5 (${doctor.reviews} reviews)\n  ${doctor.available ? '✅ Available today' : '❌ Not available today'}\n\n`;
    });
    
    response += 'You can view these doctors on the map. Would you like more information about any of them?';
    return response;
  };

  const generateResponse = (userInput: string): string => {
    // Check for specialty requests first
    for (const [specialty, keywords] of Object.entries(specialtiesMapping)) {
      for (const keyword of keywords) {
        if (userInput.includes(keyword)) {
          return findDoctorsBySpecialty(specialty.charAt(0).toUpperCase() + specialty.slice(1));
        }
      }
      
      // Direct specialty mentions
      if (userInput.includes(specialty)) {
        return findDoctorsBySpecialty(specialty.charAt(0).toUpperCase() + specialty.slice(1));
      }
    }
    
    // Check for direct doctor requests
    if (userInput.includes('doctor') || userInput.includes('specialist') || userInput.includes('physicians')) {
      // List all specialties available
      const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));
      let response = 'Here are the medical specialties available in our database:\n\n';
      specialties.forEach(specialty => {
        response += `- ${specialty}\n`;
      });
      response += '\nYou can ask about any of these specialties, or ask for doctors near a specific location in Pune.';
      return response;
    }
    
    // Check for symptoms
    for (const [symptom, responses] of Object.entries(symptomsMapping)) {
      if (userInput.includes(symptom)) {
        return responses.join(' ');
      }
    }
    
    // Basic conversation handling
    if (userInput.includes('hello') || userInput.includes('hi')) {
      return 'Hello! How are you feeling today? Can you describe any symptoms you\'re experiencing or what type of doctor you\'re looking for?';
    } else if (userInput.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    } else if (userInput.includes('appointment')) {
      return 'To book an appointment, please select a doctor from the list or map and click the "Book" button on their profile.';
    } else if (userInput.includes('emergency')) {
      return 'If this is a medical emergency, please call emergency services immediately or visit your nearest emergency room.';
    } else if (userInput.includes('pune') || userInput.includes('location')) {
      return 'Our service currently covers doctors in Pune, India. You can view their locations on the map and filter them by specialty.';
    } else {
      // Default fallback response
      return 'I can help you find doctors by specialty or help with health questions. Try asking about a specific specialist (like "cardiologist"), a symptom (like "headache"), or say "show me all doctors".';
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
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
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
