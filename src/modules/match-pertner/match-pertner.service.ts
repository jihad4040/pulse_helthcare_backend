import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchPertnerService {
  constructor(private readonly prisma: PrismaService) { }

  async getMatches(userId: string) {
    // 1. Get the current user's onboarding data
    const currentUser = await this.prisma.onbording.findUnique({
      where: { userId },
    });

    if (!currentUser || !currentUser.helthData) {
      throw new NotFoundException('User onboarding data not found');
    }

    const currentHealthData = currentUser.helthData as Record<string, any>;

    // 2. Get all other users' onboarding data, including their basic user profile
    const otherUsers = await this.prisma.onbording.findMany({
      where: {
        userId: { not: userId },
      },
      include: {
        users: {
          select: {
            userId: true,
            name: true,
            email: true,
            profile: true,
          }
        }
      }
    });

    // 3. Calculate match score for each user based on helthData keys and values
    const scoredUsers = otherUsers.map((user) => {
      let score = 0;
      const userHealthData = (user.helthData || {}) as Record<string, any>;

      for (const category in currentHealthData) {
        if (userHealthData[category]) {
          for (const key in currentHealthData[category]) {
            if (
              userHealthData[category][key] !== undefined &&
              userHealthData[category][key] === currentHealthData[category][key]
            ) {
              score++;
            }
          }
        }
      }

      return {
        ...user,
        matchScore: score,
      };
    });

    // 4. Sort by highest score and take top 10
    scoredUsers.sort((a, b) => b.matchScore - a.matchScore);
    return scoredUsers.slice(0, 10);
  }
}
