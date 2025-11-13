import { Module } from "@nestjs/common";
import { InstoreSaleController } from "./instore_sale.controller";
import { InstoreSaleService } from "./instore_sale.service";

@Module({
    imports: [],
    controllers: [InstoreSaleController],
    providers: [InstoreSaleService],
})
export class InstoreSaleModule {}