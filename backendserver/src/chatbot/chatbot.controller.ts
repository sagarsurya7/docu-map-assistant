import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('api')
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Post('/chat')
  async chat(@Body('message') message: string) {
    const response = await this.chatbotService.getResponse(message);
    return { reply: response };
  }
}