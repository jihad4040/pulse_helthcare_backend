import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map to store connected users: userId -> socketId
  private connectedUsers = new Map<string, string>();

  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) { }

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers['authorization']?.split(' ')[1];

      if (!token) {
        throw new Error('Unauthorized');
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const userId = payload.sub || payload.userId;

      client.data.userId = userId;
      this.connectedUsers.set(userId, client.id);

      console.log(`User connected to socket: ${userId}`);
    } catch (error) {
      console.log('Socket connection unauthorized');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.userId) {
      this.connectedUsers.delete(client.data.userId);
      console.log(`User disconnected from socket: ${client.data.userId}`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { receiverId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.userId;

    // Save to database using existing service
    const message = await this.messageService.sendMessage(senderId, data);

    // If receiver is currently online, push the new message to them
    const receiverSocketId = this.connectedUsers.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('newMessage', message);
    }

    return message; // Acknowledgment for the sender
  }

  @SubscribeMessage('getConversation')
  async handleGetConversation(
    @MessageBody() data: { partnerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId;
    const conversation = await this.messageService.getConversation(
      userId,
      data.partnerId,
    );
    return conversation; // Return conversation directly to the requesting client
  }
}
