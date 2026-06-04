import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { status } from '@prisma/client';

@Controller('admin-dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) { }

  @Get('admin-overview')
  async adminOverview() {
    return this.adminDashboardService.adminOverview();
  };


  @Delete('delete-user/:userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.adminDashboardService.deleteUser(userId);
  };

  @Get('get-user-by-id/:userId')
  async getUserById(@Param('userId') userId: string) {
    return this.adminDashboardService.getUserById(userId);
  };

  @Patch('update-user-status/:userId')
  async updateUserStatus(@Param('userId') userId: string, @Body('status') status: status) {
    return this.adminDashboardService.updateUserStatus(userId, status);
  };

  @Get('all-group')
  async getAllGroup(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.adminDashboardService.getAllGroup(page, limit);
  }

  @Get('group-analytics/:groupId')
  async getGroupAnalytics(@Param('groupId') groupId: string) {
    return this.adminDashboardService.getGroupAnalytics(groupId);
  }

}
