import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ReactionType } from '@prisma/client';

export class PostReactionDto {
  @ApiProperty({ example: 'b011043f-4cd1-4d4c-94a7-3dde07244a74' })
  @IsUUID()
  @IsNotEmpty()
  groupPostId!: string;

  @ApiProperty({ enum: ReactionType, example: ReactionType.LIKE })
  @IsEnum(ReactionType)
  @IsNotEmpty()
  reaction!: ReactionType;
}
