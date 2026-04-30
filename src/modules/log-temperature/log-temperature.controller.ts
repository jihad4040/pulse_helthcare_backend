import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LogTemperatureService } from './log-temperature.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { GetCurrentUser } from 'src/common/decorator/get-current-user.decorator';
import { LogTemperatureDto } from './dto/log.temperature.dto';

@Controller('log-temperature')
export class LogTemperatureController {
  constructor(private readonly logTemperatureService: LogTemperatureService) {}

  @Roles('USER')
  @Post('add-temperature')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async AddTemperature(
    @GetCurrentUser(`userId`) userId: string,
    @Body() data: LogTemperatureDto,
  ) {
    const result = await this.logTemperatureService.createLogTemperature(
      userId,
      data,
    );

    return {
      success: true,
      message: 'Log added successfully',
      data: result,
    };
  }

  @Roles('USER')
  @Get('lon-temperature-report')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async logTemperature(@GetCurrentUser('userId') userId: string) {
    const result =
      await this.logTemperatureService.last30DaysTemperatureReport(userId);

    return {
      success: true,
      data: result,
    };
  }
}
