import { Module } from '@nestjs/common';
import { OnbordingService } from './onbording.service';
import { OnbordingController } from './onbording.controller';

@Module({
  controllers: [OnbordingController],
  providers: [OnbordingService],
})
export class OnbordingModule {}
