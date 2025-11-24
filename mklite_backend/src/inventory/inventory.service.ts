import { Injectable, BadRequestException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { Inventory } from './inventory.entity';
import { Product } from '../product/product.entity';
import { UpdateInventoryDto } from './dto/update_inventory.dto';

@Injectable()
export class InventoryService {

  // obtener inventario completo
  async getAllInventory() {
    return AppDataSource.manager.find(Inventory, {
      relations: ['product'],
      order: { id_inventory: 'ASC' }
    });
  }

  // actualizar stock
  async updateStock(dto: UpdateInventoryDto) {
    const inventory = await AppDataSource.manager.findOne(Inventory, {
      where: { product: { id_product: dto.productId } },
      relations: ['product']
    });

    if (!inventory) throw new BadRequestException('Inventario no encontrado');
    
    inventory.quantity += dto.quantity; // puede ser + o -
    
    if (inventory.quantity < 0) 
      throw new BadRequestException(`Stock insuficiente para ${inventory.product.name}`);

    await AppDataSource.manager.save(Inventory, inventory);

    return { message: 'Inventario actualizado', inventory };
  }

  // opcional: obtener stock de un producto
  async getStockByProduct(productId: number) {
    const inventory = await AppDataSource.manager.findOne(Inventory, {
      where: { product: { id_product: productId } },
      relations: ['product']
    });
    if (!inventory) throw new BadRequestException('Inventario no encontrado');
    return inventory;
  }
}