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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorator/get-current-user.decorator';

@ApiTags('Group Post')
@Controller('group-post')
export class GroupPostController {
  constructor(private readonly groupPostService: GroupPostService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @GetCurrentUser('userId') userId: string,
    @Body() createGroupPostDto: CreateGroupPostDto,
  ) {
    return this.groupPostService.createPost(userId, createGroupPostDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUser('userId') userId: string) {
    return this.groupPostService.deletePost(userId, id);
  }

  @Get('group/:groupId')
  findAll(@Param('groupId') groupId: string) {
    return this.groupPostService.getPostsByGroupId(groupId);
  }
}
