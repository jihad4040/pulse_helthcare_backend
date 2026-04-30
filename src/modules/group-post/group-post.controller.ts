import { Controller } from '@nestjs/common';
import { GroupPostService } from './group-post.service';

@Controller('group-post')
export class GroupPostController {
  constructor(private readonly groupPostService: GroupPostService) {}
}
