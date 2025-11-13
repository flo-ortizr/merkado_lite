import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { Notification } from "./notification.entity";

@Injectable()
export class NotificationService {
    async sendNotification(message: string, userId: number) {
        // Lógica para enviar una notificación al usuario con userId
        console.log(`Enviando notificación al usuario ${userId}: ${message}`);
        // Aquí podrías integrar con un servicio de correo electrónico, SMS, etc.
    }

    async getNotificationsForUser(userId: number) {
        // Lógica para obtener notificaciones del usuario con userId
        console.log(`Obteniendo notificaciones para el usuario ${userId}`);
        // Aquí podrías consultar una base de datos o un servicio externo
        return [
            { id: 1, message: "Notificación 1 para el usuario " + userId },
            { id: 2, message: "Notificación 2 para el usuario " + userId },
        ];
    } 
}