import { Controller, Get, Param, Patch } from "@nestjs/common";
import { NotificationService } from "./notification.service";

@Controller('/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/user/:userId')
  async getNotifications(@Param('userId') userId: number) {
    return this.notificationService.getNotificationsForUser(userId);
  }

  @Patch('/:id/read')
  async markAsRead(@Param('id') id: number) {
    return this.notificationService.markAsRead(id);
  }
}
