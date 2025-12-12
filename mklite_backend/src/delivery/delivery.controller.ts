import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { AssignDeliveryDto } from './dto/assign_delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update_delivery_status.dto';
import { ScheduleDeliveryDto } from './dto/schedule_delivery.dto';

@Controller('/delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('/assign')
  async assign(@Body() dto: AssignDeliveryDto) {
    return this.deliveryService.assignDelivery(dto);
  }

  @Post('/update-status')
  async updateStatus(@Body() dto: UpdateDeliveryStatusDto) {
    return this.deliveryService.updateStatus(dto);
  }

  @Get('/driver/:id')
  async driverHistory(@Param('id') driverId: number) {
    return this.deliveryService.getDeliveriesByDriver(driverId);
  }

  @Post('schedule/:customerId')
  async schedule(
    @Param('customerId') customerId: number,
    @Body() dto: ScheduleDeliveryDto
  ) {
    return this.deliveryService.scheduleDelivery(customerId, dto);
  }
}
