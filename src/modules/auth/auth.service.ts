import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSignUpDto } from './dto/user.singup.dto';
import { ERROR_MESSAGES } from 'src/common/constants';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { firebaseAdmin } from 'src/config/firebase.config';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IEnv } from 'src/config/env.config';
@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const env = this.configService.get<IEnv>('env');
    this.transporter = nodemailer.createTransport({
      host: env?.SMTP_EMAIL_CONFIG.EMAIL_HOST,
      port: Number(env?.SMTP_EMAIL_CONFIG.EMAIL_PORT),
      secure: Number(env?.SMTP_EMAIL_CONFIG.EMAIL_PORT) === 465,
      auth: {
        user: env?.SMTP_EMAIL_CONFIG.EMAIL_USER,
        pass: env?.SMTP_EMAIL_CONFIG.EMAIL_PASSWORD,
      },
    });
  }

  async hast(text: string) {
    const hash = await bcrypt.hash(text, 10);

    return hash;
  }

  async userSignUp(data: UserSignUpDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    const checkPhone = await this.prisma.user.findUnique({
      where: {
        phone: data.phone,
      },
    });

    if (user)
      throw new BadRequestException(ERROR_MESSAGES.USER.USER_ALREADY_EXISTS);
    if (checkPhone)
      throw new BadRequestException(ERROR_MESSAGES.USER.PHONE_ALREADY_EXISTS);

    const hastPassword = await this.hast(data.password);

    const create = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hastPassword,
      },
      select: {
        userId: true,
        name: true,
        email: true,
        phone: true,
        profile: true,
        role: true,
      },
    });

    return create;
  }

  async signIn(data: LoginDto) {
    const { email } = data;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.verifidStatus === 'SUSPEND') {
      throw new ForbiddenException('Account suspended');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid)
      throw new NotFoundException(ERROR_MESSAGES.AUTH.INVALID_PASSWORD);

    const tokens = await this.generateTokens(user.userId, user.email);

    const currentCredentials = user.credentials || [];
    const newCredentials = [...new Set([...currentCredentials, 'CREDENTIALS' as any])];

    const updateData: any = {
      refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
    };
    if (data.fcmToken && data.fcmToken !== user.fcmToken) {
      updateData.fcmToken = data.fcmToken;
    }
    if (!currentCredentials.includes('CREDENTIALS' as any)) {
      updateData.credentials = newCredentials;
    }

    user = await this.prisma.user.update({
      where: { userId: user.userId },
      data: updateData,
    });

    const { password, otp, refreshToken, ...rest } = user;

    return {
      message: 'Login successful',
      tokens,
      user: rest,
    };
  }

  async findUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!user) throw new NotFoundException(ERROR_MESSAGES.USER.USER_NOT_FOUND);

    const { password, otp, refreshToken, ...rest } = user;

    return rest;
  }

  async generateTokens(userId: string, email: string) {
    const env = this.configService.get<IEnv>('env');
    const payload = { sub: userId, email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: env?.JWT_CONFIG.JWT_SECRET,
      expiresIn: '7d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: env?.JWT_CONFIG.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { userId: userId },
      data: {
        refreshToken: hashed,
      },
    });
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { userId: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isMatch) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.generateTokens(user.userId, user.email);

    await this.updateRefreshToken(user.userId, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { userId: userId },
      data: {
        refreshToken: null,
      },
    });

    return {
      message: 'Logout successful',
    };
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { userId },
      data: {
        name: data.name,
        age: data.age,
      },
      select: {
        userId: true,
        name: true,
        email: true,
        phone: true,
        age: true,
        profile: true,
        role: true,
      },
    });

    return user;
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect old password');
    }

    const hashedNewPassword = await this.hast(data.newPassword);

    await this.prisma.user.update({
      where: { userId },
      data: {
        password: hashedNewPassword,
      },
    });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER.USER_NOT_FOUND);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.prisma.user.update({
      where: { email: data.email },
      data: { otp },
    });

    const env = this.configService.get<IEnv>('env');
    const mailOptions = {
      from: `"${env?.SMTP_EMAIL_CONFIG.EMAIL_FROM_NAME}" <${env?.SMTP_EMAIL_CONFIG.EMAIL_FROM}>`,
      to: data.email,
      subject: 'Password Recovery OTP',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333;">Password Recovery</h2>
          <p style="color: #555;">You requested a password reset. Here is your One-Time Password (OTP):</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px; margin: 20px 0;">${otp}</h1>
          <p style="color: #555;">This OTP is valid for 15 minutes. Do not share it with anyone.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email send failed:', error);
      throw new BadRequestException('Failed to send OTP email');
    }

    return { message: 'OTP sent to email successfully' };
  }

  async verifyOtp(data: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER.USER_NOT_FOUND);
    }

    if (!user.otp || user.otp !== data.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    const env = this.configService.get<IEnv>('env');
    const resetToken = await this.jwtService.signAsync(
      { email: user.email, purpose: 'reset-password' },
      { secret: env?.JWT_CONFIG.JWT_SECRET, expiresIn: '15m' },
    );

    await this.prisma.user.update({
      where: { email: user.email },
      data: { otp: null },
    });

    return { 
      message: 'OTP verified successfully',
      resetToken,
    };
  }

  async resendOtp(data: ForgotPasswordDto) {
    // Re-use forgot password logic since it generates and sends a new OTP
    return this.forgotPassword(data);
  }

  async resetPassword(data: ResetPasswordDto) {
    const env = this.configService.get<IEnv>('env');
    let decoded: any;

    try {
      decoded = await this.jwtService.verifyAsync(data.token, {
        secret: env?.JWT_CONFIG.JWT_SECRET,
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (decoded.purpose !== 'reset-password') {
      throw new BadRequestException('Invalid token purpose');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER.USER_NOT_FOUND);
    }

    const hashedNewPassword = await this.hast(data.newPassword);

    await this.prisma.user.update({
      where: { email: decoded.email },
      data: {
        password: hashedNewPassword,
      },
    });

    return { message: 'Password reset successfully' };
  }

  async socialLogin(data: SocialLoginDto) {
    let decodedToken;
    try {
      decodedToken = await firebaseAdmin.auth().verifyIdToken(data.tokenId);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired Firebase token');
    }

    const email = decodedToken.email;
    if (!email) {
      throw new BadRequestException('Email not found in the social token');
    }

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    const provider = decodedToken.firebase?.sign_in_provider === 'apple.com' ? 'APPLE' : 'GOOGLE';

    if (!user) {
      const randomPassword = await this.hast(Math.random().toString(36).slice(-10) + 'A1@');
      
      user = await this.prisma.user.create({
        data: {
          name: decodedToken.name || email.split('@')[0],
          email: email,
          password: randomPassword,
          credentials: [provider as any],
          fcmToken: data.fcmToken,
          profile: decodedToken.picture || null,
        },
      });
    } else {
      const currentCredentials = user.credentials || [];
      const newCredentials = [...new Set([...currentCredentials, provider as any])];
      
      const updateData: any = {};
      if (data.fcmToken && data.fcmToken !== user.fcmToken) {
        updateData.fcmToken = data.fcmToken;
      }
      if (!currentCredentials.includes(provider as any)) {
        updateData.credentials = newCredentials;
      }

      if (Object.keys(updateData).length > 0) {
        user = await this.prisma.user.update({
          where: { email },
          data: updateData,
        });
      }
    }

    if (user.verifidStatus === 'SUSPEND') {
      throw new ForbiddenException('Account suspended');
    }

    const tokens = await this.generateTokens(user.userId, user.email);
    await this.updateRefreshToken(user.userId, tokens.refreshToken);

    const { password, otp, refreshToken, ...rest } = user;

    return {
      message: 'Login successful',
      tokens,
      user: rest,
    };
  }
}
