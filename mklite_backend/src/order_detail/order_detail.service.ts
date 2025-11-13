import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { OrderDetail } from "./order_detail.entity";

@Injectable()
export class OrderDetailService {
    async getOrderDetails() {
        return await AppDataSource.manager.find("order_detail");
    }

    async getOrderDetailById(id: number) {
        return await AppDataSource.manager.findOneBy("order_detail", {id_order_detail: id});
    }

    async createOrderDetail(orderDetail: any) {
        return await AppDataSource.manager.save("order_detail", orderDetail);
    }

    async updateOrderDetail(id: number, orderDetail: any) {
        return await AppDataSource.manager.update("order_detail", {id_order_detail: id}, orderDetail);
    }

    async deleteOrderDetail(id: number) {
        return await AppDataSource.manager.delete("order_detail", {id_order_detail: id});
    }
}