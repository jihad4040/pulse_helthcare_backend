import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostCommentDto {
  @ApiProperty({ example: 'This is a great post!' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({ example: 'parent-comment-uuid' })
  @IsString()
  @IsOptional()
  parentId?: string;
}
