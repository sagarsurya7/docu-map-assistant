import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';
import { ChatMessage } from '@/types';
import ChatMessageList from './chat/ChatMessageList';
import ChatInput from './chat/ChatInput';
import { initialMessages } from '@/utils/chatUtils';
import { useToast } from '@/components/ui/use-toast';
import { Doctor } from '@/types';
import { analyzeSymptoms } from '@/api/symptomService';

interface ChatBotProps {
  onSeeOnMap?: (doctorId: string, location: { lat: number; lng: number }) => void;
  allDoctors: Doctor[];
}

interface UserContext {
  location?: string;
  symptoms?: string[];
  specialty?: string;
  analysis?: {
    specialty: string;
    confidence: number;
    relatedSymptoms: string[];
    description: string;
  };
}

const ChatBot: React.FC<ChatBotProps> = ({ onSeeOnMap, allDoctors }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([...initialMessages]);
  const [isTyping, setIsTyping] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>({});
  const isMounted = useRef(true);
  const { toast } = useToast();

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const findDoctors = (specialty: string, location?: string): Doctor[] => {
    let filteredDoctors = allDoctors.filter(doctor => {
      // Normalize both the doctor's specialty and the requested specialty for comparison
      const doctorSpecialty = doctor.specialty.toLowerCase().trim();
      const requestedSpecialty = specialty.toLowerCase().trim();
      
      // Check if the doctor's specialty contains the requested specialty or vice versa
      return doctorSpecialty.includes(requestedSpecialty) || 
             requestedSpecialty.includes(doctorSpecialty) ||
             // Handle some common specialty variations
             (requestedSpecialty === 'neurology' && doctorSpecialty.includes('neurolog')) ||
             (requestedSpecialty === 'general medicine' && 
              (doctorSpecialty.includes('general') || 
               doctorSpecialty.includes('family')));
    });

    if (location) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.city.toLowerCase().includes(location.toLowerCase()) ||
        doctor.area.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Sort by rating and return top 5
    return filteredDoctors
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  };

  const handleSendMessage = async (input: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Check if this is a location input
      if (!userContext.location) {
        setUserContext(prev => ({ ...prev, location: input }));
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Thank you for providing your location. Could you please describe your symptoms?'
        }]);
        setIsTyping(false);
        return;
      }

      // Check if this is a symptoms input
      if (!userContext.symptoms) {
        const symptoms = input.split(',').map(s => s.trim());
        setUserContext(prev => ({ ...prev, symptoms }));
        
        // Analyze symptoms to determine specialty
        const analysis = await analyzeSymptoms(symptoms);
        setUserContext(prev => ({ ...prev, analysis, specialty: analysis.specialty }));
        
        // Find matching doctors
        const matchingDoctors = findDoctors(analysis.specialty, userContext.location);
        
        if (matchingDoctors.length > 0) {
          const doctorList = matchingDoctors.map(doctor => 
            `${doctor.name} (${doctor.specialty}) - Rating: ${doctor.rating}/5`
          ).join('\n');
          
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Based on your symptoms, I recommend seeing a ${analysis.specialty} (confidence: ${(analysis.confidence * 100).toFixed(0)}%).\n\n${analysis.description}\n\nHere are some top doctors in your area:\n\n${doctorList}\n\nWould you like to see any of these doctors on the map?`,
            actions: matchingDoctors.map(doctor => ({
              type: 'see_on_map',
              doctorId: doctor.id,
              doctorName: doctor.name,
              location: doctor.location
            }))
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `I couldn't find any ${analysis.specialty} doctors in your area. Would you like to try a different location or specialty?`
          }]);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      if (isMounted.current) {
        toast({
          title: "Error",
          description: "Failed to get response from AI. Please try again later.",
          variant: "destructive"
        });
      }
    } finally {
      if (isMounted.current) {
        setIsTyping(false);
      }
    }
  };

  return (
    <Card className="flex flex-col h-full border-none shadow-none relative overflow-hidden">
      <CardHeader className="py-3 px-4 border-b flex-shrink-0">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 bg-medical text-white">
            <Bot className="h-4 w-4" />
          </Avatar>
          <CardTitle className="text-base ml-2">AI Health Assistant</CardTitle>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-hidden flex flex-col h-[calc(100%-60px)]">
        <div className="flex-1 overflow-y-auto">
          <ChatMessageList 
            messages={messages} 
            isTyping={isTyping} 
            onSeeOnMap={onSeeOnMap}
          />
        </div>

        <CardFooter className="pt-3 px-4 pb-4 bg-white border-t mt-auto z-10 w-full sticky bottom-0">
          <ChatInput onSendMessage={handleSendMessage} />
        </CardFooter>
      </div>
    </Card>
  );
};

export default ChatBot;
