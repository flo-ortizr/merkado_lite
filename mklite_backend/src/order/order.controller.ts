import { Controller, Post, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { ConfirmOrderDto } from './dto/confirm_order.dto';

@Controller('/order')
export class OrderController {

  constructor(private readonly orderService: OrderService) {}

  @Post('/confirm/:customerId')
  confirmOrder(
    @Param('customerId') customerId: number,
    @Body() dto: ConfirmOrderDto
  ) {
    return this.orderService.confirmOrder(customerId, dto);
  }

  @Post('/cancel-expired')
cancelExpiredOrders() {
  return this.orderService.cancelExpiredOrders();
}

}
