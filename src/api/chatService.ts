
import apiClient from '../apiClient';

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  response: string;
}

export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  try {
    const response = await apiClient.post<ChatResponse>('/chat', { message });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};
