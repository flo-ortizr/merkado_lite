import { Module } from "@nestjs/common";
import { InStoreSaleController } from "./instore_sale.controller";
import { InStoreSaleService } from "./instore_sale.service";
import { InventoryModule } from "../inventory/inventory.module";

@Module({
    imports: [InventoryModule],
    controllers: [InStoreSaleController],
    providers: [InStoreSaleService],
})
export class InstoreSaleModule {}