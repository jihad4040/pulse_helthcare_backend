import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGroupDto {
  @ApiProperty({ example: 'Enter your group name' })
  @IsString()
  @IsNotEmpty()
  groupName!: string;

  @ApiProperty({ example: 'Enter the project description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: true,
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  isPublic!: boolean;

  @ApiProperty({ example: 'Enter the group category ID' })
  @IsString()
  @IsNotEmpty()
  groupCategoryId!: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Group cover picture' })
  @IsOptional()
  groupCoverPicture?: any;
}

export class UpdateGroupDto {
  @ApiPropertyOptional({ example: 'Updated group name' })
  @IsString()
  @IsOptional()
  groupName?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPublic?: boolean;

  @ApiPropertyOptional({ example: 'Updated group category ID' })
  @IsString()
  @IsOptional()
  groupCategoryId?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Group cover picture' })
  @IsOptional()
  groupCoverPicture?: any;
}
