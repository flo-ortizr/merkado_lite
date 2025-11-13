import { Controller, Get, Post, Delete, Put, Param } from "@nestjs/common";
import { PurchaseOrder } from "./purchase_order.entity";
import { PurchaseOrderService } from "./purchase_order.service";

@Controller('/purchaseorder')
export class PurchaseOrderController {
    constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

    @Post()
    createPurchaseOrder(purchaseorder : PurchaseOrder) {
        this.purchaseOrderService.createPurchaseOrder(purchaseorder);
    }
    
    @Get()
    getAllPurchaseOrders(){
        return this.purchaseOrderService.getAllPurchaseOrders();
    }

    @Get('/:id')
    getPurchaseOrderById(@Param() params : any){
        return this.purchaseOrderService.getPurchaseOrderById(params.id);
    }
    
    @Delete('/:id')
    deletePurchaseOrder(@Param() params : any){
        return this.purchaseOrderService.DeletePurchaseOrder(params.id);
    }

    @Put('/:id')
    updatePurchaseOrder(@Param() params : any, purchaseorder : PurchaseOrder){
        return this.purchaseOrderService.UpdatePurchaseOrder(params.id, purchaseorder);
    }
}