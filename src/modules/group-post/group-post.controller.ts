import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { GroupPostService } from './group-post.service';
import { CreateGroupPostDto } from './dto/create-group-post.dto';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { CommentReactionDto } from './dto/comment-reaction.dto';
import { PostReactionDto } from './dto/post-reaction.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorator/get-current-user.decorator';

@ApiTags('Group Post')
@Controller('group-post')
export class GroupPostController {
  constructor(private readonly groupPostService: GroupPostService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(
    @GetCurrentUser('userId') userId: string,
    @Body() createGroupPostDto: CreateGroupPostDto,
  ) {
    return this.groupPostService.createPost(userId, createGroupPostDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string, @GetCurrentUser('userId') userId: string) {
    return this.groupPostService.deletePost(userId, id);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get all posts for a group' })
  findAll(@Param('groupId') groupId: string) {
    return this.groupPostService.getPostsByGroupId(groupId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('add-comment/:postId')
  @ApiOperation({ summary: 'Add a comment or reply to a post' })
  addComment(
    @Param('postId') postId: string,
    @GetCurrentUser() user: any,
    @Body() data: CreatePostCommentDto,
  ) {
    return this.groupPostService.addComment(user?.userId, postId, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-comments/:postId')
  @ApiOperation({ summary: 'Get all comments for a post (Facebook style)' })
  getComments(
    @Param('postId') postId: string,
    @GetCurrentUser() user: any,
  ) {
    return this.groupPostService.getComments(postId, user?.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('toggle-comment-reaction/:commentId')
  @ApiOperation({ summary: 'Toggle reaction (like) on a comment' })
  toggleCommentReaction(
    @Param('commentId') commentId: string,
    @GetCurrentUser() user: any,
    @Body() data: CommentReactionDto,
  ) {
    return this.groupPostService.toggleCommentReaction(user?.userId, commentId, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('react-to-post')
  @ApiOperation({ summary: 'React to a post' })
  reactToPost(
    @GetCurrentUser() user: any,
    @Body() data: PostReactionDto,
  ) {
    return this.groupPostService.reactToPost(user?.userId, data);
  }
}
