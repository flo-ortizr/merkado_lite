import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/update_inventory.dto';

@Controller('/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getInventory() {
    return this.inventoryService.getAllInventory();
  }

  @Get('/:productId')
  async getProductStock(@Param('productId') productId: number) {
    return this.inventoryService.getStockByProduct(productId);
  }

  @Patch()
  async updateStock(@Body() dto: UpdateInventoryDto) {
    return this.inventoryService.updateStock(dto);
  }
}
