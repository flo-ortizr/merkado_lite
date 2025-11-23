import { Controller, Get, Post, Delete, Put, Param, Patch, Body } from '@nestjs/common';
import { PurchaseOrder } from './purchase_order.entity';
import { PurchaseOrderService } from './purchase_order.service';

@Controller('/purchaseorder')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post()
  createPurchaseOrder(@Body() purchaseorder: PurchaseOrder) {
    return this.purchaseOrderService.createPurchaseOrder(purchaseorder);
  }

  @Get()
  getAllPurchaseOrders() {
    return this.purchaseOrderService.getAllPurchaseOrders();
  }

  @Get('/:id')
  getPurchaseOrderById(@Param('id') id: number) {
    return this.purchaseOrderService.getPurchaseOrderById(id);
  }

  @Delete('/:id')
  deletePurchaseOrder(@Param('id') id: number) {
    return this.purchaseOrderService.DeletePurchaseOrder(id);
  }

  @Put('/:id')
  updatePurchaseOrder(@Param('id') id: number, @Body() purchaseorder: PurchaseOrder) {
    return this.purchaseOrderService.UpdatePurchaseOrder(id, purchaseorder);
  }

  // ⭐ NUEVO: Confirmar compra
  @Patch('/:id/confirm')
  confirmPurchase(@Param('id') id: number) {
    return this.purchaseOrderService.confirmPurchase(id);
  }
}