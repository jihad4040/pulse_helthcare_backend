import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OnbordingService } from './onbording.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorator/get-current-user.decorator';
import { OnbordingDto } from './dto/onbording.dto';

@Controller('onbording')
export class OnbordingController {
  constructor(private readonly onbordingService: OnbordingService) {}

  @Post('onbording')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async onbording(
    @GetCurrentUser('userId') userId: string,
    @Body() dto: OnbordingDto,
  ) {
    const result = await this.onbordingService.onbording(userId, dto);

    return {
      success: true,
      message: 'Onbording Submited success',
      data: result,
    };
  };


  @Get('get-onbording')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getOnbording(@GetCurrentUser('userId') userId: string) {
    const result = await this.onbordingService.getOnbording(userId);

     return {
      success: true,
      message: 'Onbording data retrieved successfully',
      data: result,
    }
  }
}
