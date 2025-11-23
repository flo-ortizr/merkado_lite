import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { Delivery } from './delivery.entity';
import { Order } from 'src/order/order.entity';
import { User } from 'src/user/user.entity';
import { AssignDeliveryDto } from './dto/assign_delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update_delivery_status.dto';

@Injectable()
export class DeliveryService {

  // 1. El repartidor se asigna un pedido
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

  // 2. Actualizar estado de entrega
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

  // 3. Obtener pedidos asignados a un repartidor
  async getDeliveriesByDriver(driverId: number) {
    return AppDataSource.manager.find(Delivery, {
      where: { driver: { id_user: driverId } },
      relations: ['order', 'order.details', 'order.details.product'],
      order: { scheduled_date: 'DESC' }
    });
  }
}
