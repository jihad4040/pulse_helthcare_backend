import { Test, TestingModule } from '@nestjs/testing';
import { GroupPostController } from './group-post.controller';
import { GroupPostService } from './group-post.service';

describe('GroupPostController', () => {
  let controller: GroupPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupPostController],
      providers: [GroupPostService],
    }).compile();

    controller = module.get<GroupPostController>(GroupPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
