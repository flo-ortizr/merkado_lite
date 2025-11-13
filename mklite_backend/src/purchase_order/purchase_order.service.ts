import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { PurchaseOrder } from "./purchase_order.entity";

@Injectable()
export class PurchaseOrderService {
    async createPurchaseOrder(purchaseorder: PurchaseOrder) {
        return await AppDataSource.manager.save(PurchaseOrder, purchaseorder);
    }

    async getAllPurchaseOrders() {
        return await AppDataSource.manager.find(PurchaseOrder);
    }
    
    async getPurchaseOrderById(id: number) {
        return await AppDataSource.manager.findOneBy(PurchaseOrder, {id_purchase_order: id});
    }

    async DeletePurchaseOrder(id: number) {
        return await AppDataSource.manager.delete(PurchaseOrder, {id_purchase_order: id});
    }

    async UpdatePurchaseOrder(id: number, purchaseorder: PurchaseOrder) {
        return await AppDataSource.manager.update(PurchaseOrder, {id_purchase_order: id}, purchaseorder);
    }
}