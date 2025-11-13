import { Module } from "@nestjs/common";
import { PurchaseOrderController } from "./purchase_order.controller";
import { PurchaseOrderService } from "./purchase_order.service";

@Module({
    imports: [],
    controllers: [PurchaseOrderController],
    providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {}