import { Injectable} from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { Notification } from "./notification.entity";
import { User } from "src/user/user.entity";

@Injectable()
export class NotificationService {
    async sendNotification(message: string, userId: number) {
        const user = await AppDataSource.manager.findOne(User, { where: { id_user: userId } });
        if (!user) {
            console.log(`User ${userId} not found for notification`);
            return;
        }

        const notif = AppDataSource.manager.create(Notification, {
            user,
            message,
            read: false
        });

        await AppDataSource.manager.save(Notification, notif);
    }

    async getNotificationsForUser(userId: number) {
        return AppDataSource.manager.find(Notification, {
            where: { user: { id_user: userId } },
            order: { date: "DESC" }
        });
    } 

    async markAsRead(notificationId: number) {
        const notif = await AppDataSource.manager.findOne(Notification, { where: { id_notification: notificationId } });
        if (!notif) throw new BadRequestException('Notificación no encontrada');

        notif.read = true;
        await AppDataSource.manager.save(Notification, notif);
        return { message: 'Notificación marcada como leída' };
    }
}