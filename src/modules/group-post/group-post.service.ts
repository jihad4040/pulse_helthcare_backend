import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupPostDto } from './dto/create-group-post.dto';
import { PostReactionDto } from './dto/post-reaction.dto';

@Injectable()
export class GroupPostService {
  constructor(private readonly prisma: PrismaService) { }

  async createPost(userId: string, data: CreateGroupPostDto) {
    // Check if user is a member of the group
    const membership = await this.prisma.groupMember.findFirst({
      where: {
        groupId: data.groupId,
        userId: userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You must be a member of the group to post');
    }

    return this.prisma.groupPost.create({
      data: {
        groupId: data.groupId,
        userId: userId,
        text: data.text,
      },
    });
  }

  async deletePost(userId: string, groupPostId: string) {
    const post = await this.prisma.groupPost.findUnique({
      where: { groupPostId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user is the owner of the post
    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }


    return this.prisma.groupPost.delete({
      where: { groupPostId },
    });
  }

  async getPostsByGroupId(
    groupId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {
      groupId,
      ...(search && {
        text: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const [posts, total] = await Promise.all([
      this.prisma.groupPost.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
        include: {
          user: {
            select: {
              userId: true,
              name: true,
              profile: true,
            },
          },
          _count: {
            select: {
              postReactions: true,
            },
          },
        },
      }),
      this.prisma.groupPost.count({ where }),
    ]);

    return {
      posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async reactToPost(userId: string, data: PostReactionDto) {
    const post = await this.prisma.groupPost.findUnique({
      where: { groupPostId: data.groupPostId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingReaction = await this.prisma.postReaction.findFirst({
      where: {
        groupPostId: data.groupPostId,
        userId,
      },
    });

    if (existingReaction) {
      return this.prisma.postReaction.update({
        where: { postReactionId: existingReaction.postReactionId },
        data: { reaction: data.reaction },
      });
    }

    return this.prisma.postReaction.create({
      data: {
        groupPostId: data.groupPostId,
        userId,
        reaction: data.reaction,
      },
    });
  }

  async removeReaction(userId: string, groupPostId: string) {
    const reaction = await this.prisma.postReaction.findFirst({
      where: {
        groupPostId,
        userId,
      },
    });

    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }

    return this.prisma.postReaction.delete({
      where: { postReactionId: reaction.postReactionId },
    });
  }
}
