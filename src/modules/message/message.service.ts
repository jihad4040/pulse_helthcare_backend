import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
    constructor(private readonly prisma: PrismaService) { }

    async sendMessage(senderId: string, createMessageDto: CreateMessageDto) {
        const { receiverId, text } = createMessageDto;
        console.log('Message sent:', { senderId, receiverId, text });
        return this.prisma.partnerMessage.create({
            data: {
                senderId,
                receiverId,
                text,
            },
        });
    }

    async getConversation(userId: string, partnerId: string) {
        return this.prisma.partnerMessage.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: partnerId },
                    { senderId: partnerId, receiverId: userId },
                ],
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    async getInbox(userId: string) {
        const messages = await this.prisma.partnerMessage.findMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }],
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                sender: {
                    select: { userId: true, name: true, profile: true },
                },
                receiver: {
                    select: { userId: true, name: true, profile: true },
                },
            },
        });

        const uniquePartners = new Map();

        for (const msg of messages) {
            const partnerId =
                msg.senderId === userId ? msg.receiverId : msg.senderId;
            if (!uniquePartners.has(partnerId)) {
                uniquePartners.set(partnerId, {
                    partner: msg.senderId === userId ? msg.receiver : msg.sender,
                    latestMessage: msg,
                });
            }
        }

        return Array.from(uniquePartners.values());
    }
}
