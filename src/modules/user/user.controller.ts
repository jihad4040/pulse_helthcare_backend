import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetCurrentUser } from 'src/common/decorator/get-current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('onboarding-log-temperature-for-ai')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getUserOnbordingAndLogtemperatureForAi(@GetCurrentUser('userId') userId: string) {
    return this.userService.getUserOnbordingAndLogtemperatureForAi(userId);
  }

}
