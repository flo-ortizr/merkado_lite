import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { Delivery } from './delivery.entity';
import { Order } from 'src/order/order.entity';
import { User } from 'src/user/user.entity';
import { AssignDeliveryDto } from './dto/assign_delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update_delivery_status.dto';
import { ScheduleDeliveryDto } from './dto/schedule_delivery.dto';

@Injectable()
export class DeliveryService {

  // ==================== ASIGNAR ENTREGA A REPARTIDOR ====================
  async assignDelivery(dto: AssignDeliveryDto) {

    const order = await AppDataSource.manager.findOne(Order, {
      where: { id_order: dto.id_order },
      relations: ['delivery']
    });
    if (!order) throw new BadRequestException('Pedido no encontrado');
    if (order.delivery) throw new BadRequestException('Este pedido ya fue asignado');

    const driver = await AppDataSource.manager.findOne(User, {
      where: { id_user: dto.id_driver }
    });
    if (!driver) throw new BadRequestException('Repartidor no encontrado');

    const delivery = AppDataSource.manager.create(Delivery, {
      order,
      driver,
      scheduled_date: new Date(),
      status: 'on_way'
    });

    return AppDataSource.manager.save(Delivery, delivery);
  }


  // ==================== ACTUALIZAR ESTADO DE ENTREGA ====================
  async updateStatus(dto: UpdateDeliveryStatusDto) {
    const delivery = await AppDataSource.manager.findOne(Delivery, {
      where: { id_delivery: dto.id_delivery },
      relations: ['order']
    });
    if (!delivery) throw new BadRequestException('Entrega no encontrada');

    // validar transición
    if (delivery.status === 'delivered')
      throw new BadRequestException('Este pedido ya fue entregado');

    delivery.status = dto.status;

    if (dto.status === 'delivered') {
      delivery.delivered_date = new Date();
      delivery.order.status = 'delivered';

      await AppDataSource.manager.save(Order, delivery.order);
    }

    if (dto.status === 'cancelled') {
      delivery.order.status = 'cancelled';
      await AppDataSource.manager.save(Order, delivery.order);
    }

    return AppDataSource.manager.save(Delivery, delivery);
  }

  // ==================== Obtener pedidos asignados a un repartidor ====================
  async getDeliveriesByDriver(driverId: number) {
    return AppDataSource.manager.find(Delivery, {
      where: { driver: { id_user: driverId } },
      relations: ['order', 'order.details', 'order.details.product'],
      order: { scheduled_date: 'DESC' }
    });
  }

  async scheduleDelivery(customerId: number, dto: ScheduleDeliveryDto) {

  const order = await AppDataSource.manager.findOne(Order, {
    where: { id_order: dto.id_order },
    relations: ['customer', 'delivery']
  });

  if (!order) throw new BadRequestException('Pedido no encontrado');
  if (order.customer.id_customer !== customerId)
    throw new BadRequestException('No puedes programar pedidos de otro usuario');

  if (order.status !== 'pending')
    throw new BadRequestException('Este pedido ya no se puede programar');

  if (!order.delivery)
    throw new BadRequestException('No existe registro de entrega para este pedido');

  const selectedDate = new Date(dto.scheduled_date);
  const now = new Date();

  // REGLA: no se permite programar en el pasado
  if (selectedDate <= now)
    throw new BadRequestException('La fecha debe ser futura');

  const orderTotal = Number(order.total);

  // REGLA: hasta 1 día para pedidos regulares
  if (orderTotal < 500) {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 1);

    if (selectedDate > maxDate)
      throw new BadRequestException(
        'Los pedidos regulares solo pueden programarse dentro de 24 horas'
      );
  }

  // REGLA: hasta 7 días si el total >= 500
  else {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);

    if (selectedDate > maxDate)
      throw new BadRequestException(
        'Este pedido solo puede programarse dentro de 7 días'
      );
  }

  // GUARDAR
  order.delivery.scheduled_date = selectedDate;

  // Cambiar estado del pedido
  order.status = 'delivery_scheduled';

  await AppDataSource.manager.save(Order, order);
  await AppDataSource.manager.save(Delivery, order.delivery);

  return {
    message: 'Entrega programada correctamente',
    delivery: order.delivery
  };
}

}
