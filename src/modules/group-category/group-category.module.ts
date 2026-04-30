import { Module } from '@nestjs/common';
import { GroupCategoryService } from './group-category.service';
import { GroupCategoryController } from './group-category.controller';

@Module({
  controllers: [GroupCategoryController],
  providers: [GroupCategoryService],
})
export class GroupCategoryModule {}
