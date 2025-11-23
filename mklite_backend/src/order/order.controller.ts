import { Controller, Post, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { ConfirmOrderDto } from './dto/confirm_order.dto';

@Controller('order')
export class OrderController {

  constructor(private readonly orderService: OrderService) {}

  @Post('confirm/:customerId')
  async confirmOrder(
    @Param('customerId') customerId: number,
    @Body() dto: ConfirmOrderDto,
  ) {
    return this.orderService.confirmOrder(customerId, dto);
  }
}
