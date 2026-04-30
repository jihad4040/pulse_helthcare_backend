import { Test, TestingModule } from '@nestjs/testing';
import { GroupCategoryController } from './group-category.controller';
import { GroupCategoryService } from './group-category.service';

describe('GroupCategoryController', () => {
  let controller: GroupCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupCategoryController],
      providers: [GroupCategoryService],
    }).compile();

    controller = module.get<GroupCategoryController>(GroupCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
