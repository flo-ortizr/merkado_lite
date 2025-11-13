import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { Delivery } from "./delivery.entity";

@Injectable()
export class DeliveryService {
    async deliverOrder(orderId: number) {
        // Lógica para entregar el pedido
        return `Order with ID ${orderId} has been delivered.`;
    }

    async scheduleDelivery(orderId: number, scheduledDate: Date) {
        // Lógica para programar la entrega
        return `Order with ID ${orderId} has been scheduled for delivery on ${scheduledDate}.`;
    }
}   
