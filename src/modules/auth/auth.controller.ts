import { Body, Controller, Get, Post, UseGuards, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserSignUpDto } from './dto/user.singup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.token.dto';
import { GetCurrentUser } from 'src/common/decorator/get-current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SocialLoginDto } from './dto/social-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles("ELEVATOR")
  // @Get("elevator-data")
  // getElevatorData() {
  //   return "Only elevator";
  // }

  @Post('user-singup')
  @ApiOperation({ summary: 'User SignUp (Only Can User)' })
  async userSignUp(@Body() data: UserSignUpDto) {
    const result = await this.authService.userSignUp(data);

    return {
      success: true,
      message: `Registration successful. welcome ${result.name}`,
      data: result,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'User & Admin Login' })
  async signIn(@Body() data: LoginDto) {
    const result = await this.authService.signIn(data);

    return {
      success: true,
      result,
    };
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto) {
    const { userId, refreshToken } = body;

    const result = await this.authService.refreshToken(userId, refreshToken);

    return {
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@GetCurrentUser() user: any) {
    const userId = user?.userId;

    const result = await this.authService.findUser(userId);

    return {
      success: true,
      user: result,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('update-profile')
  @ApiOperation({ summary: 'Update User Profile (name, age)' })
  async updateProfile(@GetCurrentUser() user: any, @Body() data: UpdateProfileDto) {
    const userId = user?.userId;
    const result = await this.authService.updateProfile(userId, data);

    return {
      success: true,
      message: 'Profile updated successfully',
      data: result,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @ApiOperation({ summary: 'Change User Password' })
  async changePassword(@GetCurrentUser() user: any, @Body() data: ChangePasswordDto) {
    const userId = user?.userId;
    const result = await this.authService.changePassword(userId, data);

    return {
      success: true,
      message: result.message
    };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request Password Reset OTP' })
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(data);
    return {
      success: true,
      ...result,
    };
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify Password Reset OTP' })
  async verifyOtp(@Body() data: VerifyOtpDto) {
    const result = await this.authService.verifyOtp(data);
    return {
      success: true,
      ...result,
    };
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend Password Reset OTP' })
  async resendOtp(@Body() data: ForgotPasswordDto) {
    const result = await this.authService.resendOtp(data);
    return {
      success: true,
      ...result,
    };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset Password with OTP' })
  async resetPassword(@Body() data: ResetPasswordDto) {
    const result = await this.authService.resetPassword(data);
    return {
      success: true,
      ...result,
    };
  }

  @Post('social-login')
  @ApiOperation({ summary: 'Login/Register via Google or Apple using Firebase token' })
  async socialLogin(@Body() data: SocialLoginDto) {
    const result = await this.authService.socialLogin(data);
    return {
      success: true,
      ...result,
    };
  }
}
