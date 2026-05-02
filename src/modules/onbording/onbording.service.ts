import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OnbordingDto } from './dto/onbording.dto';

@Injectable()
export class OnbordingService {
  constructor(private readonly prisma: PrismaService) {}

  async onbording(userId: string, helthData: OnbordingDto) {
    const findOnbording = await this.prisma.onbording.findUnique({
      where: {
        userId: userId,
      },
    });

    if (findOnbording) {
      throw new NotFoundException('Your onbording already submited');
    }

    const result = await this.prisma.onbording.create({
      data: {
        userId: userId,
        ...helthData,
      },
    });

    await this.prisma.user.update({
      where: { userId: userId },
      data: { isOnboarded: true },
    });

    return result;
  }
}
