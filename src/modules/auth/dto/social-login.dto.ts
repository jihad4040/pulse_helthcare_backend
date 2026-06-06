import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SocialLoginDto {
  @ApiProperty({ example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...' })
  @IsString()
  @IsNotEmpty()
  tokenId: string;

  @ApiPropertyOptional({ example: 'fcm_token_xyz_123' })
  @IsString()
  @IsOptional()
  fcmToken?: string;
}
