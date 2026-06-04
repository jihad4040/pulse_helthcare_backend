import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorator/get-current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('message')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post('send')

  async sendMessage(
    @GetCurrentUser('userId') userId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messageService.sendMessage(userId, createMessageDto);
  }

  @Get('conversation/:partnerId')
  async getConversation(
    @GetCurrentUser('userId') userId: string,
    @Param('partnerId') partnerId: string,
  ) {
    return this.messageService.getConversation(userId, partnerId);
  }

  @Get('inbox')
  async getInbox(@GetCurrentUser('userId') userId: string) {
    return this.messageService.getInbox(userId);
  }
}
