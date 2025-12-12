import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PurchaseOrderService } from './purchase_order.service';
import { CreatePurchaseOrderDto } from './dto/create_purchase_order.dto';

@Controller('/purchase-order')
export class PurchaseOrderController {
  constructor(private readonly poService: PurchaseOrderService) {}

  @Post()
  async createOrder(@Body() dto: CreatePurchaseOrderDto) {
    return this.poService.createOrder(dto
  );
  }
  
  @Get()
  async getOrders() {
    return this.poService.getOrders();
  }

  @Get('/:id')
  async getOrderById(@Param('id') id: number) {
    return this.poService.getOrderById(id);
  }
}