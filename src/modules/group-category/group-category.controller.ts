import {
  // Multer type fixed
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
import { GroupCategoryService } from './group-category.service';
import { CreateGroupCategoryDto } from './dto/create-group-category.dto';
import { UpdateGroupCategoryDto } from './dto/update-group-category.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Group Category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('group-category')
export class GroupCategoryController {
  constructor(private readonly groupCategoryService: GroupCategoryService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  async create(
    @Body() createGroupCategoryDto: CreateGroupCategoryDto,
    @UploadedFile() file: any,
  ) {
    const result = await this.groupCategoryService.create(createGroupCategoryDto, file);
    return {
      success: true,
      message: 'Category created successfully',
      data: result,
    };
  }

  @Get()
  async findAll() {
    const result = await this.groupCategoryService.findAll();
    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.groupCategoryService.findOne(id);
    return {
      success: true,
      data: result,
    };
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('icon'))
  async update(
    @Param('id') id: string,
    @Body() updateGroupCategoryDto: UpdateGroupCategoryDto,
    @UploadedFile() file?: any,
  ) {
    const result = await this.groupCategoryService.update(id, updateGroupCategoryDto, file);
    return {
      success: true,
      message: 'Category updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.groupCategoryService.remove(id);
    return {
      success: true,
      message: 'Category deleted successfully (soft delete)',
    };
  }
}
