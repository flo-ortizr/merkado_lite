import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { Promotion } from "src/promotion/promotion.entity";

@Injectable()
export class PromotionService {
    async getPromotions() {
        return await AppDataSource.manager.find(Promotion);
    }

    async getPromotionById(id: number) {
        return await AppDataSource.manager.findOneBy(Promotion, {id_promotion: id});
    }

    async createPromotion(promotion: Promotion) {
        return await AppDataSource.manager.save(Promotion, promotion);
    }

    async updatePromotion(id: number, promotion: Promotion) {
        return await AppDataSource.manager.update(Promotion, {id_promotion: id}, promotion);
    }

    async deletePromotion(id: number) {
        return await AppDataSource.manager.delete(Promotion, {id_promotion: id});
    }
}