import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { InStoreSaleService } from './instore_sale.service';
import { CreateInStoreSaleDto } from './dto/create_instore_sale.dto';

@Controller('/instore-sale')
export class InStoreSaleController {
  constructor(private readonly saleService: InStoreSaleService) {}

  @Post()
  async createSale(@Body() dto: CreateInStoreSaleDto) {
    return this.saleService.createSale(dto);
  }

  @Get('/user/:userId')
  async getSalesByUser(@Param('userId') userId: number) {
    return this.saleService.getSalesByUser(userId);
  }
}
