import { Injectable } from '@nestjs/common';
import { ChatOllama } from "@langchain/community/chat_models/ollama";

@Injectable()
export class ChatbotService {
  private model: ChatOllama;

  constructor() {
    this.model = new ChatOllama({
      model: 'llama3.2:1b',
    });
  }
  async getResponse(message: string): Promise<string> {
    try {
      const response = await this.model.invoke(message);
      console.log("res123", response);
      
      if (response && typeof response === 'object' && 'content' in response) {
        if (typeof response.content === 'string') {
          return response.content;
        } else if (Array.isArray(response.content)) {
          return response.content.map(item => (typeof item === 'string' ? item : JSON.stringify(item))).join(' ');
        }
      }
      
      return 'I could not understand that.';
    } catch (error) {
      console.error('Error communicating with Ollama:', error);
      return 'There was an error processing your request.';
    }
  }


}
