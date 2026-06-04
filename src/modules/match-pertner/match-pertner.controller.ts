import { Controller, Get, UseGuards } from '@nestjs/common';
import { MatchPertnerService } from './match-pertner.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorator/get-current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('match-pertner')
@UseGuards(JwtAuthGuard)
export class MatchPertnerController {
  constructor(private readonly matchPertnerService: MatchPertnerService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('matches')
  async getMatchedPartners(@GetCurrentUser('userId') userId: string) {
    return this.matchPertnerService.getMatches(userId);
  }
}
