import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGroup {
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

  @ApiProperty({ example: 'Enter the group category' })
  @IsString()
  @IsNotEmpty()
  grocategoryId!: string;
}
