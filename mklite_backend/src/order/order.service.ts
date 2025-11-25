// src/order/order.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { Cart } from 'src/cart/cart.entity';
import { Order } from './order.entity';
import { OrderDetail } from 'src/order_detail/order_detail.entity';
import { ConfirmOrderDto } from './dto/confirm_order.dto';
import { Delivery } from 'src/delivery/delivery.entity';
import { Customer } from 'src/customer/customer.entity';
import { OrderHistoryDto } from './dto/order_history.dto';

@Injectable()
export class OrderService {

  // ==================== CONFIRMAR PEDIDO ====================
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

    // 3. crear detalles 
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

  async getOrderHistory(customerId: number): Promise<OrderHistoryDto[]> {
  const customer = await AppDataSource.manager.findOne(Customer, {
    where: { id_customer: customerId },
  });

  if (!customer) throw new BadRequestException('Cliente no encontrado');

  const orders = await AppDataSource.manager.find(Order, {
    where: { customer: { id_customer: customerId } },
    relations: ['details', 'details.product'], 
    order: { order_date: 'DESC' },
  });

  if (!orders || orders.length === 0) return [];

  // mapear al DTO resumido
  return orders.map(order => ({
    id_order: order.id_order,
    order_date: order.order_date,
    status: order.status,
    total: Number(order.total),
    details: order.details.map(d => ({
      product_name: d.product.name, 
    })),
  }));
}


// ==================== CANCELAR PEDIDO ====================
async cancelExpiredOrders() {
  const now = new Date();
  const ONE_HOUR = 60 * 60 * 1000;

  // 1. Buscar pedidos pendientes
  const pendingOrders = await AppDataSource.manager.find(Order, {
    where: { status: 'pending' },
    relations: ['details', 'details.product', 'details.product.inventory'],
  });

  if (!pendingOrders || pendingOrders.length === 0) {
    return { message: 'No hay pedidos pendientes' };
  }

  let cancelled = 0;

  for (const order of pendingOrders) {
    const orderTime = new Date(order.order_date).getTime();
    const diff = now.getTime() - orderTime;

    // 2. verificar si pasaron más de 1 hora
    if (diff >= ONE_HOUR) {
      // 3. Restaurar stock por cada detalle
      for (const detail of order.details) {
        const inv = detail.product.inventory;
        if (inv) {
          inv.quantity += detail.quantity;
          await AppDataSource.manager.save(inv);
        }
      }

      // 4. Cambiar estado a cancelado
      order.status = 'cancelled';
      await AppDataSource.manager.save(order);

      cancelled++;
    }
  }

  return {
    message: `Proceso finalizado`,
    cancelled,
  };
}


}
