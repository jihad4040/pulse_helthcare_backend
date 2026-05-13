import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateGroupPostDto {
  @ApiProperty({ example: 'b011043f-4cd1-4d4c-94a7-3dde07244a74' })
  @IsUUID()
  @IsNotEmpty()
  groupId!: string;

  @ApiProperty({ example: 'Hello group!' })
  @IsString()
  @IsNotEmpty()
  text!: string;
}
