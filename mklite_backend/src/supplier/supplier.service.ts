import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { Supplier } from './supplier.entity';
import { CreateSupplierDto } from './dto/create_supplier.dto';
import { UpdateSupplierDto } from './dto/update_supplier.dto';

@Injectable()
export class SupplierService {
  
  async create(dto: CreateSupplierDto) {
    const exists = await AppDataSource.manager.findOne(Supplier, {
      where: [{ email: dto.email }, { name: dto.name }]
    });

    if (exists) throw new BadRequestException('Proveedor duplicado');

    const supplier = AppDataSource.manager.create(Supplier, dto);
    return AppDataSource.manager.save(Supplier, supplier);
  }

  async findAll() {
    return AppDataSource.manager.find(Supplier);
  }

  async findOne(id: number) {
    const supplier = await AppDataSource.manager.findOne(Supplier, {
      where: { id_supplier: id }
    });

    if (!supplier) throw new NotFoundException('Proveedor no encontrado');
    return supplier;
  }

  async findByName(name: string) {
  return AppDataSource.manager
    .getRepository(Supplier)
    .createQueryBuilder('s')
    .where('LOWER(s.name) LIKE LOWER(:name)', { name: `%${name}%` })
    .getMany();
}

async findByEmail(email: string) {
  return AppDataSource.manager.find(Supplier, {
    where: { email }
  });
}

async findByCategory(category: string) {
  return AppDataSource.manager
    .getRepository(Supplier)
    .createQueryBuilder('s')
    .where('LOWER(s.category) LIKE LOWER(:category)', { category: `%${category}%` })
    .getMany();
}

  async update(id: number, dto: UpdateSupplierDto) {
    const supplier = await this.findOne(id);
    Object.assign(supplier, dto);
    return AppDataSource.manager.save(Supplier, supplier);
  }

  async remove(id: number) {
    const supplier = await this.findOne(id);
    return AppDataSource.manager.remove(Supplier, supplier);
  }
}
