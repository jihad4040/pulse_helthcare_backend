import { Module } from '@nestjs/common';
import { FindPertnerService } from './find-pertner.service';
import { FindPertnerController } from './find-pertner.controller';

@Module({
  controllers: [FindPertnerController],
  providers: [FindPertnerService],
})
export class FindPertnerModule {}
