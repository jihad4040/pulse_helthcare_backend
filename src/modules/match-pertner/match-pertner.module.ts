import { Module } from '@nestjs/common';
import { MatchPertnerService } from './match-pertner.service';
import { MatchPertnerController } from './match-pertner.controller';

@Module({
  controllers: [MatchPertnerController],
  providers: [MatchPertnerService],
})
export class MatchPertnerModule {}
