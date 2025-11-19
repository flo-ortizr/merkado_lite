import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { PurchaseOrder } from './purchase_order.entity';
import { OrderDetail } from '../order_detail/order_detail.entity';
import { Inventory } from '../inventory/inventory.entity';

@Injectable()
export class PurchaseOrderService {
  async createPurchaseOrder(purchaseorder: PurchaseOrder) {
    return AppDataSource.manager.save(PurchaseOrder, purchaseorder);
  }

  async getAllPurchaseOrders() {
    return AppDataSource.manager.find(PurchaseOrder);
  }

  async getPurchaseOrderById(id: number) {
    return AppDataSource.manager.findOneBy(PurchaseOrder, { id_purchase_order: id });
  }

  async DeletePurchaseOrder(id: number) {
    return AppDataSource.manager.delete(PurchaseOrder, { id_purchase_order: id });
  }

  async UpdatePurchaseOrder(id: number, purchaseorder: PurchaseOrder) {
    return AppDataSource.manager.update(PurchaseOrder, { id_purchase_order: id }, purchaseorder);
  }

  // ⭐ NUEVA FUNCIÓN: Confirmar compra
  async confirmPurchase(id: number) {
    // 1. Buscar la orden
    const order = await AppDataSource.manager.findOne(PurchaseOrder, {
      where: { id_purchase_order: id },
      relations: ['supplier'], // por si se necesita luego
    });

    if (!order) {
      throw new NotFoundException('Orden de compra no encontrada');
    }

    if (order.status === 'received') {
      throw new BadRequestException('La orden ya fue confirmada anteriormente');
    }

    // 2. Buscar detalles vinculados a esta orden
    const details = await AppDataSource.manager.find(OrderDetail, {
      where: { order: { id_order: id } },
      relations: ['product', 'product.inventory'],
    });

    if (details.length === 0) {
      throw new BadRequestException('La orden no tiene detalles');
    }

    // 3. Actualizar inventario
    for (const item of details) {
      const product = item.product;
      const inventory = product.inventory;

      if (!inventory) {
        throw new BadRequestException(
          El producto ${product.name} no tiene inventario asignado
        );
      }

      inventory.quantity = Number(inventory.quantity) + Number(item.quantity);

      await AppDataSource.manager.save(Inventory, inventory);
    }

    // 4. Cambiar estado de la orden
    order.status = 'received';
    await AppDataSource.manager.save(PurchaseOrder, order);

    return {
      message: 'Orden confirmada y stock actualizado correctamente',
      order,
    };
  }
}