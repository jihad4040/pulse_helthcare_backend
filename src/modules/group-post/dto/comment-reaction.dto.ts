import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReactionType } from '@prisma/client';

export class CommentReactionDto {
  @ApiProperty({ enum: ReactionType, example: ReactionType.LIKE })
  @IsEnum(ReactionType)
  @IsNotEmpty()
  reaction: ReactionType;
}
