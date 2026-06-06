import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { status } from '@prisma/client';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { NotificationService } from '../notification/notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin-dashboard')
export class AdminDashboardController {
  constructor(
    private readonly adminDashboardService: AdminDashboardService,
    private readonly notificationService: NotificationService
  ) { }

  @Get('admin-overview')
  @ApiOperation({ summary: 'Get admin overview (Only For Admin)' })
  async adminOverview() {
    return this.adminDashboardService.adminOverview();
  };


  // @Delete('delete-user/:userId')
  // @ApiOperation({ summary: 'Delete user (Only For Admin)' })
  // async deleteUser(@Param('userId') userId: string) {
  //   return this.adminDashboardService.deleteUser(userId);
  // };

  @Get('get-user-by-id/:userId')
  @ApiOperation({ summary: 'Get user by id (Only For Admin Dashboard)' })
  async getUserById(@Param('userId') userId: string) {
    return this.adminDashboardService.getUserById(userId);
  };

  // @Patch('update-user-status/:userId')
  // @ApiOperation({ summary: 'Update user status (Only For Admin)' })
  // async updateUserStatus(@Param('userId') userId: string, @Body('status') status: status) {
  //   return this.adminDashboardService.updateUserStatus(userId, status);
  // };

  @Get('all-group')
  @ApiOperation({ summary: 'Get all group (Only For Admin)' })
  async getAllGroup(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.adminDashboardService.getAllGroup(page, limit);
  }

  @Get('group-analytics/:groupId')
  @ApiOperation({ summary: 'Get single group analytics (Only For Admin)' })
  async getGroupAnalytics(@Param('groupId') groupId: string) {
    return this.adminDashboardService.getGroupAnalytics(groupId);
  }

  @Get('all-users')
  @ApiOperation({ summary: 'Get all users (Only For Admin)' })
  async getAllUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.adminDashboardService.getAllUsers(Number(page), Number(limit));
  }

  @Post('send-notification')
  @ApiOperation({ summary: 'Send a push notification to all users (Only For Admin)' })
  async sendNotificationToAll(@Body() data: SendNotificationDto) {
    const result = await this.notificationService.sendToAllUsers(data.title, data.body, data.data);
    return {
      success: true,
      message: 'Notification sent successfully to all users',
      data: result,
    };
  }
}

