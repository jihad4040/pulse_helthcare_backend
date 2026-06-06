import { Injectable, Logger } from '@nestjs/common';
import { firebaseAdmin } from 'src/config/firebase.config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Send a notification to a specific user by their userId
   */
  async sendToUser(userId: string, title: string, body: string, data?: Record<string, string>) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { userId },
        select: { fcmToken: true, isNotification: true },
      });

      if (!user) {
        this.logger.warn(`User ${userId} not found for notification.`);
        return;
      }

      if (!user.isNotification) {
        this.logger.log(`User ${userId} has notifications disabled.`);
        return;
      }

      if (!user.fcmToken) {
        this.logger.warn(`User ${userId} does not have an FCM token.`);
        return;
      }

      const message = {
        notification: { title, body },
        data: data || {},
        token: user.fcmToken,
      };

      // Store the notification in the database
      await this.prisma.notification.create({
        data: {
          userId,
          title,
          body,
          data: data || {},
        },
      });

      const response = await firebaseAdmin.messaging().send(message);
      this.logger.log(`Successfully sent message to user ${userId}: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(`Error sending message to user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Send a notification to multiple FCM tokens
   */
  async sendToTokens(tokens: string[], title: string, body: string, data?: Record<string, string>) {
    if (!tokens || tokens.length === 0) return;

    try {
      const message = {
        notification: { title, body },
        data: data || {},
        tokens: tokens,
      };

      const response = await firebaseAdmin.messaging().sendEachForMulticast(message);
      this.logger.log(`Successfully sent multicast message: ${response.successCount} successes, ${response.failureCount} failures.`);
      return response;
    } catch (error) {
      this.logger.error(`Error sending multicast message:`, error);
      throw error;
    }
  }

  /**
   * Send a notification to a specific topic
   */
  async sendToTopic(topic: string, title: string, body: string, data?: Record<string, string>) {
    try {
      const message = {
        notification: { title, body },
        data: data || {},
        topic: topic,
      };

      const response = await firebaseAdmin.messaging().send(message);
      this.logger.log(`Successfully sent message to topic ${topic}: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(`Error sending message to topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Get notification history for a user
   */
  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Send a notification to all users in the platform
   */
  async sendToAllUsers(title: string, body: string, data?: Record<string, string>) {
    try {
      const allUsers = await this.prisma.user.findMany({
        select: { userId: true, fcmToken: true, isNotification: true },
      });

      if (allUsers.length === 0) return;

      const notificationData = allUsers.map(u => ({
        userId: u.userId,
        title,
        body,
        data: data || {},
      }));

      await this.prisma.notification.createMany({
        data: notificationData,
      });

      const validTokens = allUsers
        .filter(u => u.isNotification && u.fcmToken)
        .map(u => u.fcmToken!);

      if (validTokens.length === 0) {
        this.logger.log('No valid FCM tokens found to send multicast message.');
        return { successCount: 0, failureCount: 0 };
      }

      const chunkSize = 500;
      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < validTokens.length; i += chunkSize) {
        const tokenChunk = validTokens.slice(i, i + chunkSize);
        const message = {
          notification: { title, body },
          data: data || {},
          tokens: tokenChunk,
        };

        const response = await firebaseAdmin.messaging().sendEachForMulticast(message);
        successCount += response.successCount;
        failureCount += response.failureCount;
      }

      this.logger.log(`Successfully sent broadcast message: ${successCount} successes, ${failureCount} failures.`);
      return { successCount, failureCount };
    } catch (error) {
      this.logger.error(`Error sending broadcast message:`, error);
      throw error;
    }
  }

  /**
   * Mark a specific notification as read
   */
  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { notificationId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
