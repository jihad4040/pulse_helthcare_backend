import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/create.group.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) { }

  async createGroup(
    userId: string,
    data: CreateGroupDto,
    file: any,
  ) {
    let groupCoverPicture = '';
    if (file) {
      const uploadResult: any = await this.cloudinary.uploadImageFromBuffer(
        file.buffer,
        'groups',
        `${Date.now()}-${file.originalname}`,
      );
      groupCoverPicture = uploadResult.secure_url;
    }

    const group = await this.prisma.group.create({
      data: {
        groupName: data.groupName,
        description: data.description,
        isPublic: data.isPublic === true || (data.isPublic as any) === 'true',
        groupCategoryId: data.groupCategoryId,
        groupCoverPicture,
        userId,
        groupMembers: {
          create: {
            userId,
          },
        },
      },
    });

    return group;
  }

  async deleteGroup(groupId: string, userId: string) {
    const group = await this.prisma.group.findUnique({
      where: { groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this group');
    }

    return this.prisma.group.delete({
      where: { groupId },
    });
  }

  async getMyGroups(userId: string) {
    return this.prisma.group.findMany({
      where: {
        OR: [
          { userId: userId },
          {
            groupMembers: {
              some: {
                userId: userId
              }
            }
          }
        ]
      },
      include: {
        user: {
          select: { name: true, profile: true, userId: true }
        },
        groupCategory: true,
        groupPosts: {
        take: 1,
        orderBy: {
          createdAt: 'desc' // newest post first
        }
      },
        _count: {
          select: {
            groupMembers: true,
            groupPosts: true
          }
        },
      }
    });
  }

  async getAllGroups() {
    return this.prisma.group.findMany({
      include: {
        groupCategory: true,
        user: {
          select: { name: true, profile: true },
        },
        groupPosts: {
        take: 1,
        orderBy: {
          createdAt: 'desc' // newest post first
        }
      },
        _count: {
          select: { groupMembers: true, groupPosts: true },
        },
      },
    });
  }

  async getGroupById(groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { groupId },
      include: {
        groupCategory: true,
        user: {
          select: { name: true, profile: true },
        },
        _count: {
          select: { groupMembers: true, groupPosts: true },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return group;
  }

  async joinGroup(groupId: string, userId: string) {
    const group = await this.prisma.group.findUnique({
      where: { groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const existingMember = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
      },
    });

    if (existingMember) {
      throw new ForbiddenException('You are already a member of this group');
    }

    return this.prisma.groupMember.create({
      data: {
        groupId,
        userId,
      },
    });
  }

  async leaveGroup(groupId: string, userId: string) {
    const membership = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
      },
    });

    if (!membership) {
      throw new NotFoundException('You are not a member of this group');
    }

    return this.prisma.groupMember.delete({
      where: {
        groupMemberId: membership.groupMemberId,
      },
    });
  }
}
