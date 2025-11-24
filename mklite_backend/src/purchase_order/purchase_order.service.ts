import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { PurchaseOrder } from './purchase_order.entity';
import { Supplier } from '../supplier/supplier.entity';
import { CreatePurchaseOrderDto } from './dto/create_purchase_order.dto';
import { Product } from '../product/product.entity';

@Injectable()
export class PurchaseOrderService {

  async createOrder(dto: CreatePurchaseOrderDto) {
    // Validar proveedor
    const supplier = await AppDataSource.manager.findOne(Supplier, {
      where: { id_supplier: dto.supplierId }
    });
    if (!supplier) throw new BadRequestException('Proveedor no encontrado');

    // Crear orden de compra
    const order = AppDataSource.manager.create(PurchaseOrder, {
      supplier,
      order_date: new Date(),
      total: dto.total,
      status: 'pending'
    });

    const savedOrder = await AppDataSource.manager.save(PurchaseOrder, order);

    // Aquí podemos guardar los productos de la orden en otra tabla
    // Por ahora, solo devuelve la info de la orden y los productos solicitados
    return {
      message: 'Orden de compra creada correctamente (PDF simulado)',
      order: savedOrder,
      productsRequested: dto.products
    };
  }

  async getOrders() {
    return AppDataSource.manager.find(PurchaseOrder, {
      relations: ['supplier'],
      order: { order_date: 'DESC' }
    });
  }

  async getOrderById(orderId: number) {
    const order = await AppDataSource.manager.findOne(PurchaseOrder, {
      where: { id_purchase_order: orderId },
      relations: ['supplier']
    });
    if (!order) throw new BadRequestException('Orden no encontrada');
    return order;
  }
}
