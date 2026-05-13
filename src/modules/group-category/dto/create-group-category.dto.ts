import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupCategoryDto {
  @ApiProperty({ example: 'Health' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Category icon file' })
  icon: any;
}
