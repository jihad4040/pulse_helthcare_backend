import { Module } from '@nestjs/common';
import { LogTemperatureService } from './log-temperature.service';
import { LogTemperatureController } from './log-temperature.controller';

@Module({
  controllers: [LogTemperatureController],
  providers: [LogTemperatureService],
})
export class LogTemperatureModule {}
