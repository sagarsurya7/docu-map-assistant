
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './schemas/chat.schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: { message: string }) {
    return this.chatService.processMessage(body.message);
  }

  @Get('history')
  async getChatHistory(): Promise<Chat[]> {
    return this.chatService.getChatHistory();
  }
}
