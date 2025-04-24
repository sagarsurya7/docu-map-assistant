import { Controller, Post, Body, Put } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('api')
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Post('/chat')
  async chat(@Body('message') message: string) {
    const response = await this.chatbotService.getResponse(message);
    return { reply: response };
  }

  @Put('analyze')
  async analyzeSymptoms(@Body() body: { text: string }) {
    const { text } = body;
    return this.chatbotService.getResponse(text);
  }
}