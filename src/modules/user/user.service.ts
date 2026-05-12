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


    async last30DaysTemperatureReport(userId: string) {
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const last30DaysReport = await this.prisma.logTemperature.findMany({
            where: {
                userId: userId,
                date: {
                    gte: startDate,
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        const heightTemperature = await this.prisma.logTemperature.aggregate({
            where: { userId, date: { gte: startDate } },
            _max: { temperature: true },
        });

        const lowestTemperature = await this.prisma.logTemperature.aggregate({
            where: { userId, date: { gte: startDate } },
            _min: { temperature: true },
        });

        const averageTemperature = await this.prisma.logTemperature.aggregate({
            where: { userId, date: { gte: startDate } },
            _avg: { temperature: true },
        });

        const avgTemp = Number(averageTemperature._avg.temperature || 0);

        const lastItem = last30DaysReport[last30DaysReport.length - 1];

        const currentTemp = Number(lastItem?.temperature || 0);

        let currentPhase = 'Follicular';

        if (last30DaysReport.length <= 5) {
            currentPhase = 'Menstrual';
        } else if (last30DaysReport.length <= 13) {
            currentPhase = 'Follicular';
        } else if (currentTemp > avgTemp + 0.3) {
            currentPhase = 'Luteal';
        } else if (currentTemp < avgTemp - 0.2) {
            currentPhase = 'Ovulation';
        }

        const reportWithPhase = last30DaysReport.map((item, index) => {
            const temp = Number(item.temperature);

            let phase = 'Follicular';

            if (index < 5) {
                phase = 'Menstrual';
            } else if (index >= 5 && index < 13) {
                phase = 'Follicular';
            } else if (temp > avgTemp + 0.3) {
                phase = 'Luteal';
            } else if (temp < avgTemp - 0.2) {
                phase = 'Ovulation';
            }

            return {
                ...item,
                phase,
            };
        });

        return {
            heightTemperature: heightTemperature._max.temperature || 0,
            lowestTemperature: lowestTemperature._min.temperature || 0,
            currentPhase,
            averageTemperature: avgTemp,
            last30DaysReport: reportWithPhase,
        };
    }

}
