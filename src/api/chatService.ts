
import apiClient from '../apiClient';

export interface ChatMessage {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
}

// Store session ID in local storage or memory
let currentSessionId = localStorage.getItem('chatSessionId') || '';

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  try {
    const response = await apiClient.post<ChatResponse>('/chat', { 
      message, 
      sessionId: currentSessionId 
    });
    
    // Save the session ID for future messages
    if (response.data.sessionId) {
      currentSessionId = response.data.sessionId;
      localStorage.setItem('chatSessionId', currentSessionId);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};
