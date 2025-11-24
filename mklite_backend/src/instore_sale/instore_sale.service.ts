import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { InStoreSale } from './instore_sale.entity';
import { InStoreSaleDetail } from 'src/instore_sale_detail/instore_sale_detail.entity';
import { CreateInStoreSaleDto } from './dto/create_instore_sale.dto';
import { Product } from 'src/product/product.entity';
import { Inventory } from 'src/inventory/inventory.entity';
import { User } from 'src/user/user.entity';
import { InventoryService } from 'src/inventory/inventory.service';
import { CancelSaleDto } from './dto/cancel_sale.dto';
import { ReturnItemDto } from './dto/return_item.dto';

@Injectable()
export class InStoreSaleService {

  constructor(
  private readonly inventoryService: InventoryService,) {}

  async createSale(dto: CreateInStoreSaleDto) {
    // 1. validar vendedor
    const user = await AppDataSource.manager.findOne(User, { where: { id_user: dto.userId } });
    if (!user) throw new BadRequestException('Vendedor no encontrado');

    // 2. crear venta
    const sale = AppDataSource.manager.create(InStoreSale, {
      user,
      sale_date: new Date(),
      total: 0,
      payment_method: dto.payment_method,
      details: []
    });
    const savedSale = await AppDataSource.manager.save(InStoreSale, sale);

    let total = 0;

    // 3. procesar productos
    for (const item of dto.items) {
      const product = await AppDataSource.manager.findOne(Product, { where: { id_product: item.productId } });
      if (!product) throw new BadRequestException(`Producto con id ${item.productId} no encontrado`);

      const inventory = await AppDataSource.manager.findOne(Inventory, { where: { product: { id_product: item.productId } } });
      if (!inventory) throw new BadRequestException(`Inventario no encontrado para ${product.name}`);
      if (inventory.quantity < item.quantity) throw new BadRequestException(`Stock insuficiente para ${product.name}`);

      // descontar stock
      await this.inventoryService.updateStock({ productId: item.productId, quantity: -item.quantity });

      // crear detalle de venta
      const subtotal = Number(item.quantity) * Number(product.price);
      total += subtotal;

      const detail = AppDataSource.manager.create(InStoreSaleDetail, {
        sale: savedSale,
        product,
        quantity: item.quantity,
        subtotal
      });
      await AppDataSource.manager.save(InStoreSaleDetail, detail);
    }

    // actualizar total
    savedSale.total = total;
    await AppDataSource.manager.save(InStoreSale, savedSale);

    return savedSale;
  }

  // listar ventas de un vendedor
  async getSalesByUser(userId: number) {
    const sales = await AppDataSource.manager.find(InStoreSale, {
      where: { user: { id_user: userId } },
      relations: ['details', 'details.product'],
      order: { sale_date: 'DESC' }
    });
    return sales;
  }

  async cancelSale(dto: CancelSaleDto) {

    const sale = await AppDataSource.manager.findOne(InStoreSale, {
      where: { id_sale: dto.saleId },
      relations: ['details', 'details.product']
    });

    if (!sale) throw new BadRequestException('Venta no encontrada');
    if (sale.status === 'cancelled') throw new BadRequestException('La venta ya está anulada');

    // restaurar inventario de cada producto
    for (const item of sale.details) {
      await this.inventoryService.updateStock({
        productId: item.product.id_product,
        quantity: item.quantity // los devuelve
      });
    }

    sale.status = 'cancelled';
    sale.cancel_reason = dto.reason;

    await AppDataSource.manager.save(InStoreSale, sale);

    return { message: 'Venta anulada y stock restaurado', sale };
  }

  async returnItem(dto: ReturnItemDto) {

    const sale = await AppDataSource.manager.findOne(InStoreSale, {
      where: { id_sale: dto.saleId },
      relations: ['details', 'details.product']
    });

    if (!sale) throw new BadRequestException('Venta no encontrada');
    if (sale.status === 'cancelled') throw new BadRequestException('La venta está anulada');

    const detail = sale.details.find(d => d.product.id_product === dto.productId);
    if (!detail) throw new BadRequestException('El producto no pertenece a esta venta');

    if (dto.quantity > detail.quantity)
      throw new BadRequestException('Cantidad mayor a la comprada');

    // devolver stock
    await this.inventoryService.updateStock({
      productId: dto.productId,
      quantity: dto.quantity
    });

    // actualizar detalle
    detail.quantity -= dto.quantity;
    detail.subtotal = detail.quantity * Number(detail.product.price);
    await AppDataSource.manager.save(InStoreSaleDetail, detail);

    // recalcular total
    sale.total = sale.details.reduce((acc, d) => acc + d.subtotal, 0);
    await AppDataSource.manager.save(InStoreSale, sale);

    return { message: 'Devolución procesada', sale };
  }
}