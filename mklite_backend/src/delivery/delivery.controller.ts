import { Controller, Post, Param, Body } from '@nestjs/common';
import { DeliveryService } from './delivery.service';

@Controller ('/delivery')
export class DeliveryController {
    
    constructor(private readonly deliveryService: DeliveryService) {}
    
    @Post('/deliver/:orderId')
    deliverOrder(@Param('orderId') orderId: number) {
        return this.deliveryService.deliverOrder(orderId);
    }

    @Post('/schedule/:orderId')
    scheduleDelivery(@Param('orderId') orderId: number, @Body('scheduledDate') scheduledDate: Date) {
        return this.deliveryService.scheduleDelivery(orderId, scheduledDate);
    }
}