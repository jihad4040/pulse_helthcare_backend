import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ example: 'Important Update' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Please check the new features.' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({ example: { type: 'system_update' } })
  @IsObject()
  @IsOptional()
  data?: Record<string, string>;
}
