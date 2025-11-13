import { Controller, Get, Post, Put, Delete, Param } from "@nestjs/common";
import { OrderDetailService } from "./order_detail.service";
import { OrderDetail } from "./order_detail.entity";

@Controller('order-detail')
export class OrderDetailController {
    constructor(private readonly orderDetailService: OrderDetailService) {}

    @Get()
    getOrderDetails() {
        return this.orderDetailService.getOrderDetails();
    }

    @Get('/:id')
    getOrderDetailById(@Param() params: any) {
        return this.orderDetailService.getOrderDetailById(params.id);
    }

    @Post()
    createOrderDetail(orderDetail: any) {
        return this.orderDetailService.createOrderDetail(orderDetail);
    }

    @Put('/:id')
    updateOrderDetail(@Param() params: any, orderDetail: any) {
        return this.orderDetailService.updateOrderDetail(params.id, orderDetail);
    }

    @Delete('/:id')
    deleteOrderDetail(@Param() params: any) {
        return this.orderDetailService.deleteOrderDetail(params.id);
    }

}