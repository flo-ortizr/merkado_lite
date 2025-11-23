// src/order/order.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { Cart } from 'src/cart/cart.entity';
import { Order } from './order.entity';
import { OrderDetail } from 'src/order_detail/order_detail.entity';
import { ConfirmOrderDto } from './dto/confirm_order.dto';
import { Delivery } from 'src/delivery/delivery.entity';

@Injectable()
export class OrderService {

  async confirmOrder(customerId: number, dto: ConfirmOrderDto) {

    // 1. obtener carrito activo
    const cart = await AppDataSource.manager.findOne(Cart, {
      where: { customer: { id_customer: customerId }, status: 'active' },
      relations: ['items', 'items.product'],
    });

    if (!cart) throw new BadRequestException('El cliente no tiene carrito activo');
    if (!cart.items || cart.items.length === 0)
      throw new BadRequestException('El carrito está vacío');

    // 2. crear orden
    const order = AppDataSource.manager.create(Order, {
      customer: cart.customer,
      order_date: new Date(),
      status: 'pending',
      payment_method: dto.payment_method,
      total: 0,
    });

    const savedOrder = await AppDataSource.manager.save(Order, order);

    // 3. crear detalles (SIN descontar stock)
    let total = 0;

    for (const item of cart.items) {

      const subtotal = Number(item.quantity) * Number(item.product.price);
      total += subtotal;

      const detail = AppDataSource.manager.create(OrderDetail, {
        order: savedOrder,
        product: item.product,
        quantity: item.quantity,
        subtotal,
      });

      await AppDataSource.manager.save(OrderDetail, detail);
    }

    // 4. actualizar total
    savedOrder.total = total;
    await AppDataSource.manager.save(Order, savedOrder);

    // 5. crear registro de entrega
    const delivery = AppDataSource.manager.create(Delivery, {
      order: savedOrder,
      method: dto.delivery_method,
      status: 'pending',
    });

    await AppDataSource.manager.save(Delivery, delivery);

    // 6. cerrar carrito
    cart.status = 'ordered';
    await AppDataSource.manager.save(Cart, cart);

    return {
      message: 'Pedido generado exitosamente',
      order: savedOrder,
      delivery,
    };
  }
}
