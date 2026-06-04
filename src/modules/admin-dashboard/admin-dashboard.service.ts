import { Injectable, NotFoundException } from '@nestjs/common';
import { status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminDashboardService {

    constructor(private readonly prisma: PrismaService) { }

    async deleteUser(userId: string) {
        return this.prisma.user.delete({ where: { userId } });
    }

    async adminOverview() {
        const totalUser = await this.prisma.user.count();
        const totalGroup = await this.prisma.group.count();
        const totalGroupPost = await this.prisma.groupPost.count();
        const totalActiveUser = await this.prisma.user.count({ where: { status: 'ACTIVE' } });
        const totalInactiveUser = await this.prisma.user.count({ where: { status: 'INACTIVE' } });
        const totalSuspendUser = await this.prisma.user.count({ where: { status: 'SUSPEND' } });
        const totalPendingUser = await this.prisma.user.count({ where: { status: 'PENDING' } });


        // Calculate last 12 months user growth
        const last12MonthsGrowth: any = [];
        const currentDate = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Fetch the count of the month immediately preceding our 12-month window
        // to calculate the growth for the very first month in the 12-month array.
        const startOfFirstMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1);
        const startOfPrevFirstMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 12, 1);

        let prevMonthCount = await this.prisma.user.count({
            where: {
                createdAt: {
                    gte: startOfPrevFirstMonth,
                    lt: startOfFirstMonth,
                }
            }
        });

        for (let i = 11; i >= 0; i--) {
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);

            // Count users created in this month
            const count = await this.prisma.user.count({
                where: {
                    createdAt: {
                        gte: startDate,
                        lt: endDate,
                    }
                }
            });

            // Calculate month-over-month growth percentage
            let growthPercentage = 0;
            if (prevMonthCount > 0) {
                growthPercentage = ((count - prevMonthCount) / prevMonthCount) * 100;
            } else if (count > 0) {
                growthPercentage = 100; // if previous month was 0, but this month has users, default to 100% growth
            }

            const monthName = monthNames[startDate.getMonth()];
            const formattedGrowth = parseFloat(growthPercentage.toFixed(2));

            last12MonthsGrowth.push({
                month: monthName,
                year: startDate.getFullYear(),
                count: count,
                growthPercentage: formattedGrowth,
                growthText: `${monthName} ${formattedGrowth > 0 ? '+' : ''}${formattedGrowth}%`
            });

            // Update prevMonthCount for the next iteration
            prevMonthCount = count;
        }


        return {
            totalUser,
            totalGroup,
            totalGroupPost,
            totalActiveUser,
            totalInactiveUser,
            totalSuspendUser,
            totalPendingUser,
            last12MonthsGrowth
        }
    }

    async getUserById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { userId },
            include: {
                onbording: true,
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    };

    async updateUserStatus(userId: string, status: status) {
        const user = await this.prisma.user.update({
            where: { userId },
            data: { status }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    };

    async getAllGroup(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.group.findMany({
                skip,
                take: limit,
                include: {
                    user: true,
                    _count: {
                        select: {
                            groupPosts: true,
                            groupMembers: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.group.count()
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    async getGroupAnalytics(groupId: string) {
        const group = await this.prisma.group.findUnique({
            where: { groupId },
            select: { groupId: true, groupName: true, createdAt: true, groupCategory: true, isPublic: true }
        });

        if (!group) {
            throw new NotFoundException('Group not found');
        }

        const recentPosts = await this.prisma.groupPost.findMany({
            where: { groupId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                user: {
                    select: { name: true, profile: true }
                }
            }
        });

        const recentMembers = await this.prisma.groupMember.findMany({
            where: { groupId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: {
                user: {
                    select: { name: true, profile: true, email: true }
                }
            }
        });

        const last5DaysActivity: any = [];
        const currentDate = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        for (let i = 4; i >= 0; i--) {
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);

            const postsCount = await this.prisma.groupPost.count({
                where: {
                    groupId,
                    createdAt: {
                        gte: startDate,
                        lt: endDate
                    }
                }
            });

            const joinsCount = await this.prisma.groupMember.count({
                where: {
                    groupId,
                    createdAt: {
                        gte: startDate,
                        lt: endDate
                    }
                }
            });

            last5DaysActivity.push({
                date: `${monthNames[startDate.getMonth()]} ${startDate.getDate()}`,
                fullDate: startDate.toISOString().split('T')[0],
                posts: postsCount,
                joins: joinsCount
            });
        }

        return {
            group,
            recentPosts,
            recentMembers,
            last5DaysActivity
        };
    }
}
