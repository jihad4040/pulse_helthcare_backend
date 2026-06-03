import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchPertnerService {
  constructor(private readonly prisma: PrismaService) {}

  async findPertner(senderId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        userId: {
          not: senderId,
        },
        status: 'ACTIVE',
      },
      select: {
        userId: true,
        name: true,
        profile: true,
        onbording: true,
      },
      take: 20,
    });

    return users.sort(() => 0.5 - Math.random()).slice(0, 5);
  }
}
