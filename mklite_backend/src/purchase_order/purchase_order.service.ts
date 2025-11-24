import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { PurchaseOrder } from './purchase_order.entity';
import { Supplier } from '../supplier/supplier.entity';
import { CreatePurchaseOrderDto } from './dto/create_purchase_order.dto';
import { Product } from '../product/product.entity';
import { PurchaseOrderItem } from '../purchase_order_item/purchase_order_item.entity';

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
      status: 'pending',
       items: []
    });

    // Guardar productos en tabla detalle
    for (const p of dto.products) {
      const product = await AppDataSource.manager.findOne(Product, {
        where: { id_product: p.productId }
      });
      if (!product) throw new BadRequestException(`Producto ${p.productId} no encontrado`);

      const item = AppDataSource.manager.create(PurchaseOrderItem, {
        purchaseOrder: order,
        product,
        quantity: p.quantity,
        unit_price: p.unit_price
      });

      order.items.push(item);
    }


    const savedOrder = await AppDataSource.manager.save(PurchaseOrder, order);

    return {
      message: 'Orden de compra creada correctamente (PDF simulado)',
      order: savedOrder
    };
  }

  async getOrders() {
    return AppDataSource.manager.find(PurchaseOrder, {
      relations: ['supplier', 'items', 'items.product'],
      order: { order_date: 'DESC' }
    });
  }

  async getOrderById(orderId: number) {
    const order = await AppDataSource.manager.findOne(PurchaseOrder, {
      where: { id_purchase_order: orderId },
      relations: ['supplier', 'items', 'items.product']
    });
    if (!order) throw new BadRequestException('Orden no encontrada');
    return order;
  }
}
