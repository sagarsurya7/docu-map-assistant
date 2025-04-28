
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './schemas/chat.schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: { message: string, sessionId?: string }) {
    // Generate a session ID if not provided
    const sessionId = body.sessionId || `session-${Date.now()}`;
    return this.chatService.processMessage(body.message, sessionId);
  }

  @Get('history')
  async getChatHistory(): Promise<Chat[]> {
    return this.chatService.getChatHistory();
  }

  @Get('session/:sessionId')
  async getSessionInfo(@Param('sessionId') sessionId: string) {
    return this.chatService.getSessionInfo(sessionId);
  }
}
