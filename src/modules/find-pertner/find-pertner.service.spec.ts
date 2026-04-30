import { Test, TestingModule } from '@nestjs/testing';
import { FindPertnerService } from './find-pertner.service';

describe('FindPertnerService', () => {
  let service: FindPertnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindPertnerService],
    }).compile();

    service = module.get<FindPertnerService>(FindPertnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
