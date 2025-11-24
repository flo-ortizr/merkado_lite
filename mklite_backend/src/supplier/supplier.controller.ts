import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create_supplier.dto';
import { UpdateSupplierDto } from './dto/update_supplier.dto';

@Controller('/supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  create(@Body() dto: CreateSupplierDto) {
    return this.supplierService.create(dto);
  }

  @Get()
  findAll() {
    return this.supplierService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.supplierService.findOne(id);
  }

  @Get('/search/name')
  findByName(@Query('name') name: string) {
    return this.supplierService.findByName(name);
  }

  @Get('/search/email')
  findByEmail(@Query('email') email: string) {
    return this.supplierService.findByEmail(email);
  }

  @Get('/search/category')
  findByCategory(@Query('category') category: string) {
    return this.supplierService.findByCategory(category);
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() dto: UpdateSupplierDto) {
    return this.supplierService.update(id, dto);
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.supplierService.remove(id);
  }
}
