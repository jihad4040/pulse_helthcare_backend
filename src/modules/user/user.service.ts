import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) { }


    async getUserOnbordingAndLogtemperatureForAi(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                userId: userId
            },
            include: {
                onbording: true,
                logTemperature: true
            }
        });

        if (!user) {
            throw new NotFoundException(`User not found`);
        }

        const { password, otp, refreshToken, ...rest } = user;

        return rest;

    }

}
