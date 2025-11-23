import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { InStoreSale } from './instore_sale.entity';
import { InStoreSaleDetail } from 'src/instore_sale_detail/instore_sale_detail.entity';
import { CreateInStoreSaleDto } from './dto/create_instore_sale.dto';
import { Product } from 'src/product/product.entity';
import { Inventory } from 'src/inventory/inventory.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class InStoreSaleService {

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
      inventory.quantity -= item.quantity;
      await AppDataSource.manager.save(Inventory, inventory);

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

  // opcional: listar ventas de un vendedor
  async getSalesByUser(userId: number) {
    const sales = await AppDataSource.manager.find(InStoreSale, {
      where: { user: { id_user: userId } },
      relations: ['details', 'details.product'],
      order: { sale_date: 'DESC' }
    });
    return sales;
  }
}
