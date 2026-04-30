import { Controller } from '@nestjs/common';
import { FindPertnerService } from './find-pertner.service';

@Controller('find-pertner')
export class FindPertnerController {
  constructor(private readonly findPertnerService: FindPertnerService) {}
}
