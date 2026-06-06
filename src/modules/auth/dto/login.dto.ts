import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: "user@gmail.com" })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "12345678" })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiPropertyOptional({ example: "fcm_token_xyz" })
    @IsString()
    @IsOptional()
    fcmToken?: string;

}