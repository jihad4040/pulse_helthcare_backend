import { Controller } from '@nestjs/common';
import { GroupCategoryService } from './group-category.service';

@Controller('group-category')
export class GroupCategoryController {
  constructor(private readonly groupCategoryService: GroupCategoryService) {}
}
