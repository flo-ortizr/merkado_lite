import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderService {
    async getOrderStatus(orderId: number): Promise<string> {
        // Lógica para obtener el estado del pedido desde la base de datos
        return "Estado del pedido";
    }

    async updateOrderStatus(orderId: number, status: string): Promise<void> {
        // Lógica para actualizar el estado del pedido en la base de datos
    }
}