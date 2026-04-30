import { Module } from '@nestjs/common';
import { GroupPostService } from './group-post.service';
import { GroupPostController } from './group-post.controller';

@Module({
  controllers: [GroupPostController],
  providers: [GroupPostService],
})
export class GroupPostModule {}
