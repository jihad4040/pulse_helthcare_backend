import { Controller, Get, UseGuards } from '@nestjs/common';
import { MatchPertnerService } from './match-pertner.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetCurrentUser } from 'src/common/decorator/get-current-user.decorator';

@Controller('match-pertner')
@UseGuards(JwtAuthGuard)
export class MatchPertnerController {
  constructor(private readonly matchPertnerService: MatchPertnerService) {}

  @Get()
  async findPertner(@GetCurrentUser('userId') userId: string) {
    return this.matchPertnerService.findPertner(userId);
  }
}
