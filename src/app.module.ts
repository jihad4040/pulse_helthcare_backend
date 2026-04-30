import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { LogTemperatureModule } from './modules/log-temperature/log-temperature.module';
import { GroupModule } from './modules/group/group.module';
import { GroupPostModule } from './modules/group-post/group-post.module';
import { MessageModule } from './modules/message/message.module';
import { GroupCategoryModule } from './modules/group-category/group-category.module';
import { FindPertnerModule } from './modules/find-pertner/find-pertner.module';
import { PaymentModule } from './modules/payment/payment.module';
import envConfig from './config/env.config';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      cache: true,
    }),
    AuthModule,
    UserModule,
    CloudinaryModule,
    LogTemperatureModule,
    GroupModule,
    GroupPostModule,
    MessageModule,
    GroupCategoryModule,
    FindPertnerModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }