import { Test, TestingModule } from '@nestjs/testing';
import { GroupCategoryService } from './group-category.service';

describe('GroupCategoryService', () => {
  let service: GroupCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupCategoryService],
    }).compile();

    service = module.get<GroupCategoryService>(GroupCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
