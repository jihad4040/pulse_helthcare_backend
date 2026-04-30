import { Test, TestingModule } from '@nestjs/testing';
import { FindPertnerController } from './find-pertner.controller';
import { FindPertnerService } from './find-pertner.service';

describe('FindPertnerController', () => {
  let controller: FindPertnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindPertnerController],
      providers: [FindPertnerService],
    }).compile();

    controller = module.get<FindPertnerController>(FindPertnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
