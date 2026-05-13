import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/create.group.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorator/get-current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new group' })
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('groupCoverPicture'))
  create(
    @GetCurrentUser('userId') userId: string,
    @Body() createGroupDto: CreateGroupDto,
    @UploadedFile() file: any,
  ) {
    return this.groupService.createGroup(userId, createGroupDto, file);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my groups' })
  @UseGuards(JwtAuthGuard)
  @Get('my-groups')
  getMyGroups(@GetCurrentUser('userId') userId: string) {
    return this.groupService.getMyGroups(userId);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all groups' })
  findAll() {
    return this.groupService.getAllGroups();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  findOne(@Param('id') id: string) {
    return this.groupService.getGroupById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a group by ID' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUser('userId') userId: string) {
    return this.groupService.deleteGroup(id, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join a group' })
  @UseGuards(JwtAuthGuard)
  @Post('join/:groupId')
  joinGroup(
    @Param('groupId') groupId: string,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.groupService.joinGroup(groupId, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave a group' })
  @UseGuards(JwtAuthGuard)
  @Delete('leave/:groupId')
  leaveGroup(
    @Param('groupId') groupId: string,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.groupService.leaveGroup(groupId, userId);
  }
}
