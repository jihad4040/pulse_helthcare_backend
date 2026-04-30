import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class LogTemperatureDto {
  @ApiProperty({ example: '2026-04-30T12:37:05.865Z' })
  @IsNotEmpty()
  @IsString()
  date!: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsNumber()
  temperature!: string;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  isFahrenheit!: boolean;

  @ApiProperty({ example: 'Time Measured' })
  @IsOptional()
  @IsString()
  timeMeasured?: string;

  @ApiProperty({ example: 'Optional Note' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    example: ['fever', 'morning'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  quickTag?: string[];
}
