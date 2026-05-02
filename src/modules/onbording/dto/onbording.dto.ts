import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class OnbordingDto {
  @ApiProperty({ example: 'Enter your name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Enter your email' })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Enter your Life Stage' })
  @IsString()
  @IsNotEmpty()
  lifeStage!: string;

  @ApiProperty({ example: 'Enter your mdeia location' })
  @IsString()
  @IsNotEmpty()
  whereFrom!: string;

  @ApiProperty({
    example: {},
    type: Object,
  })
  @IsNotEmpty()
  @IsObject()
  helthData!: any;
}
