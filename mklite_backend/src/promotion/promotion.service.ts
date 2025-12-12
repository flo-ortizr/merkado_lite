import { Injectable, NotFoundException } from '@nestjs/common';
import { AppDataSource } from '../data-source';
import { Promotion } from './promotion.entity';
import { Product } from '../product/product.entity';
import { CreatePromotionDto } from './dto/create_promotion.dto';
import { UpdatePromotionDto } from './dto/update_promotion.dto';

@Injectable()
export class PromotionService {
  private promotionRepo = AppDataSource.getRepository(Promotion);
  private productRepo = AppDataSource.getRepository(Product);

  // ESTADO AUTOMÁTICO
  private getPromotionStatus(start: Date, end: Date): string {
    const now = new Date();

    if (now < start) return 'scheduled';
    if (now >= start && now <= end) return 'active';
    return 'expired';
  }

  // ==================== CREAR PROMO ====================
  async create(dto: CreatePromotionDto) {
  // Asegurarse de que sea array
  const productIds = dto.product_ids || [];

  const products = productIds.length
    ? await this.productRepo.findByIds(productIds)
    : [];

  const promotion = this.promotionRepo.create({
    ...dto,
    products,
    status: this.getPromotionStatus(
      new Date(dto.start_date),
      new Date(dto.end_date)
    ),
  });

  return await this.promotionRepo.save(promotion);
}


  // ==================== VER TODAS ====================
  async findAll() {
    const list = await this.promotionRepo.find({
      relations: ['products'],
    });

    for (const promo of list) {
      const newStatus = this.getPromotionStatus(promo.start_date, promo.end_date);
      if (promo.status !== newStatus) {
        promo.status = newStatus;
        await this.promotionRepo.save(promo);
      }
    }

    return list;
  }

  // ==================== VER 1 POR ID ====================
  async findOne(id: number) {
    const promo = await this.promotionRepo.findOne({
      where: { id_promotion: id },
      relations: ['products'],
    });

    if (!promo) throw new NotFoundException('Promoción no encontrada');

    promo.status = this.getPromotionStatus(promo.start_date, promo.end_date);

    return promo;
  }

  // ==================== EDITAR PROMO ====================
  async update(id: number, dto: UpdatePromotionDto) {
    const promo = await this.promotionRepo.findOne({
      where: { id_promotion: id },
      relations: ['products'],
    });

    if (!promo) throw new NotFoundException('Promoción no encontrada');

    Object.assign(promo, dto);

    // Actualizar estado si cambió fecha
    if (dto.start_date || dto.end_date) {
      promo.status = this.getPromotionStatus(
        new Date(promo.start_date),
        new Date(promo.end_date),
      );
    }

    if (dto.product_ids) {
      promo.products = await this.productRepo.findByIds(dto.product_ids);
    }

    return await this.promotionRepo.save(promo);
  }

  // ==================== ELIMINAR PROMO ====================
  async remove(id: number) {
    const promo = await this.promotionRepo.findOne({
      where: { id_promotion: id },
    });

    if (!promo) throw new NotFoundException('Promoción no encontrada');

    await this.promotionRepo.remove(promo);

    return { message: 'Promoción eliminada correctamente' };
  }
}
